import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type CorrigerResult =
  | { kind: "ok"; text: string }
  | { kind: "refus" }
  | { kind: "erreur" };

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
      if (outputs.message_erreur) return { kind: "refus" };
      return { kind: "erreur" };
    } catch (e) {
      console.error("Dify fetch error", e);
      return { kind: "erreur" };
    }
  });
