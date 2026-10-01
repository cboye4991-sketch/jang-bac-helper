// Fonction Supabase « corriger » — relais entre le site Jàng (GitHub Pages) et le workflow Dify.
// La clé Dify reste ici, dans les secrets Supabase (DIFY_API_KEY) : elle n'apparaît jamais dans le site.
// À coller dans Supabase → Edge Functions → Deploy a new function → Via Editor, nom : corriger.
// Réglage obligatoire : désactiver « Verify JWT » pour cette fonction (le site n'a pas de connexion).

const ORIGINES = [
  "https://cboye4991-sketch.github.io", // site GitHub Pages
  "http://localhost:8080", // tests en local (bun run dev)
  "http://localhost:5173",
];

function cors(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin && ORIGINES.includes(origin) ? origin : ORIGINES[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  };
}

function reponse(body: unknown, origin: string | null, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json" },
  });
}

// « INSUFFISANT : ta réponse… » → « Ta réponse… » (le mot INSUFFISANT sert au SI/SINON de Dify, pas à l'élève)
function nettoyerRefus(brut: string): string {
  const sans = brut.replace(/^\s*INSUFFISANT\s*[:：-]?\s*/i, "").trim();
  return sans ? sans.charAt(0).toUpperCase() + sans.slice(1) : "";
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return reponse({ kind: "erreur" }, origin, 405);
  // Seul notre site peut appeler la fonction depuis un navigateur.
  if (origin && !ORIGINES.includes(origin)) return reponse({ kind: "erreur" }, origin, 403);

  let query = "";
  let userId = "";
  try {
    const body = await req.json();
    query = typeof body.query === "string" ? body.query.trim() : "";
    userId = typeof body.userId === "string" ? body.userId : "";
  } catch {
    return reponse({ kind: "erreur" }, origin, 400);
  }
  if (!query || query.length > 4000 || !/^[a-zA-Z0-9-]{8,64}$/.test(userId)) {
    return reponse({ kind: "erreur" }, origin, 400);
  }

  const apiKey = Deno.env.get("DIFY_API_KEY");
  if (!apiKey) {
    console.error("DIFY_API_KEY manquant");
    return reponse({ kind: "erreur", detail: "Clé API absente du serveur (secret DIFY_API_KEY non configuré)" }, origin, 500);
  }

  try {
    const res = await fetch("https://api.dify.ai/v1/workflows/run", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: { query },
        response_mode: "blocking",
        user: "jang-web-" + userId,
      }),
      signal: AbortSignal.timeout(55000),
    });
    if (!res.ok) {
      const brut = await res.text().catch(() => "");
      console.error("Dify", res.status, brut);
      let detail = `Dify ${res.status}`;
      try {
        const j = JSON.parse(brut);
        detail += " : " + [j.code, j.message].filter(Boolean).join(" — ").slice(0, 160);
      } catch { /* corps non JSON */ }
      return reponse({ kind: "erreur", detail }, origin, 502);
    }
    const json = await res.json();
    if (json?.data?.status === "failed") {
      return reponse({ kind: "erreur", detail: `Workflow Dify en échec : ${String(json.data.error ?? "").slice(0, 160)}` }, origin, 502);
    }
    const outputs = json?.data?.outputs ?? {};
    const text = typeof outputs.text === "string" ? outputs.text.trim() : "";
    if (text) return reponse({ kind: "ok", text }, origin);
    if (typeof outputs.message_erreur === "string" && outputs.message_erreur.trim()) {
      return reponse({ kind: "refus", message: nettoyerRefus(outputs.message_erreur) }, origin);
    }
    return reponse({ kind: "erreur", detail: "Réponse Dify sans sortie text ni message_erreur" }, origin, 502);
  } catch (e) {
    console.error("Dify fetch error", e);
    return reponse({ kind: "erreur", detail: "Dify injoignable ou trop lent" }, origin, 502);
  }
});
