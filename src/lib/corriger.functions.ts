import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type CorrigerResult =
  | { kind: "ok"; text: string }
  | { kind: "refus"; message: string }
  | { kind: "erreur"; detail?: string };

// « INSUFFISANT : ta réponse… » → « Ta réponse… » (le mot INSUFFISANT sert au SI/SINON de Dify, pas à l'élève)
function nettoyerRefus(brut: string): string {
  const sans = brut.replace(/^\s*INSUFFISANT\s*[:：-]?\s*/i, "").trim();
  return sans ? sans.charAt(0).toUpperCase() + sans.slice(1) : "";
}

// « Dify 400 : invalid_param — Model quota has been exceeded » (jamais la clé : seul le corps de réponse Dify est lu)
function detailDify(status: number, brut: string): string {
  try {
    const j = JSON.parse(brut) as { code?: string; message?: string };
    return `Dify ${status} : ${[j.code, j.message].filter(Boolean).join(" — ").slice(0, 160)}`;
  } catch {
    return `Dify ${status}`;
  }
}

export const corriger = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        query: z.string().trim().min(1).max(4000),
        userId: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<CorrigerResult> => {
    const apiKey = process.env["DIFY_API_KEY"];
    if (!apiKey) {
      console.error("DIFY_API_KEY manquant");
      return { kind: "erreur", detail: "Clé API absente du serveur (secret DIFY_API_KEY non configuré)" };
    }
    try {
      const res = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: { query: data.query },
          response_mode: "blocking",
          user: "jang-web-" + data.userId,
        }),
        signal: AbortSignal.timeout(58000),
      });
      if (!res.ok) {
        const brut = await res.text().catch(() => "");
        console.error("Dify", res.status, brut);
        return { kind: "erreur", detail: detailDify(res.status, brut) };
      }
      const json = (await res.json()) as {
        data?: { status?: string; error?: string | null; outputs?: { text?: string; message_erreur?: string } };
      };
      if (json.data?.status === "failed") {
        return { kind: "erreur", detail: `Workflow Dify en échec : ${(json.data.error ?? "").slice(0, 160)}` };
      }
      const outputs = json.data?.outputs ?? {};
      const text = typeof outputs.text === "string" ? outputs.text.trim() : "";
      if (text) return { kind: "ok", text: outputs.text as string };
      if (typeof outputs.message_erreur === "string" && outputs.message_erreur.trim()) {
        return { kind: "refus", message: nettoyerRefus(outputs.message_erreur) };
      }
      return { kind: "erreur", detail: "Réponse Dify sans sortie text ni message_erreur" };
    } catch (e) {
      console.error("Dify fetch error", e);
      const timeout = e instanceof Error && e.name === "TimeoutError";
      return { kind: "erreur", detail: timeout ? "Dify n'a pas répondu en 58 s" : "Dify injoignable depuis le serveur" };
    }
  });
