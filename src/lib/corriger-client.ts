import type { CorrigerResult } from "./corriger.functions";

/**
 * URL publique de la fonction Supabase « corriger » (version GitHub Pages).
 * Vide dans la version Lovable : le chat utilise alors la fonction serveur TanStack.
 * Cette URL n'est pas un secret : la clé Dify reste dans les secrets Supabase.
 */
export const CORRIGER_URL: string = import.meta.env["VITE_CORRIGER_URL"] ?? "";

export async function corrigerViaSupabase(query: string, userId: string): Promise<CorrigerResult> {
  try {
    const res = await fetch(CORRIGER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, userId }),
      signal: AbortSignal.timeout(58000),
    });
    if (!res.ok) return { kind: "erreur" };
    const json = (await res.json()) as Partial<CorrigerResult> & { text?: string; message?: string };
    if (json.kind === "ok" && typeof json.text === "string") return { kind: "ok", text: json.text };
    if (json.kind === "refus") return { kind: "refus", message: typeof json.message === "string" ? json.message : "" };
    return { kind: "erreur" };
  } catch {
    return { kind: "erreur" };
  }
}
