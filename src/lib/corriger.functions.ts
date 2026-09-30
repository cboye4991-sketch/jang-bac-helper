import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type CorrigerResult =
  | { kind: "ok"; text: string }
  | { kind: "refus"; message: string }
  | { kind: "erreur" };

// « INSUFFISANT : ta réponse… » → « Ta réponse… » (le mot INSUFFISANT sert au SI/SINON de Dify, pas à l'élève)
function nettoyerRefus(brut: string): string {
  const sans = brut.replace(/^\s*INSUFFISANT\s*[:：-]?\s*/i, "").trim();
  return sans ? sans.charAt(0).toUpperCase() + sans.slice(1) : "";
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
      return { kind: "erreur" };
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
        console.error("Dify", res.status, await res.text().catch(() => ""));
        return { kind: "erreur" };
      }
      const json = (await res.json()) as {
        data?: { outputs?: { text?: string; message_erreur?: string } };
      };
      const outputs = json.data?.outputs ?? {};
      const text = typeof outputs.text === "string" ? outputs.text.trim() : "";
      if (text) return { kind: "ok", text: outputs.text as string };
      if (typeof outputs.message_erreur === "string" && outputs.message_erreur.trim()) {
        return { kind: "refus", message: nettoyerRefus(outputs.message_erreur) };
      }
      return { kind: "erreur" };
    } catch (e) {
      console.error("Dify fetch error", e);
      return { kind: "erreur" };
    }
  });
