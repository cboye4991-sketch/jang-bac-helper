import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  lireHistorique,
  supprimerCorrection,
  viderHistorique,
  type Correction,
} from "@/lib/historique";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique — Jàng" },
      {
        name: "description",
        content:
          "Retrouve les exercices que Jàng a corrigés pour toi et relis ses explications avant le Bac.",
      },
      { property: "og:title", content: "Historique de tes corrections — Jàng" },
      {
        property: "og:description",
        content: "Relis tes corrections passées : erreurs expliquées et exercices similaires.",
      },
    ],
  }),
  component: Historique,
});

function formatDate(ms: number) {
  return new Date(ms).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
}

function Historique() {
  // null = pas encore lu : le stockage n'existe pas côté serveur, on évite un décalage d'affichage.
  const [liste, setListe] = useState<Correction[] | null>(null);
  const [confirmer, setConfirmer] = useState(false);

  useEffect(() => {
    setListe(lireHistorique());
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Historique de tes corrections
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Relis les corrections que Jàng t'a données. Elles sont gardées uniquement sur cet appareil,
        dans ton navigateur : personne d'autre ne peut les voir.
      </p>

      {liste === null ? null : liste.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-secondary p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tu n'as pas encore d'exercice corrigé. Envoie ta première réponse à Jàng !
          </p>
          <Link
            to="/exercices"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Choisir un exercice
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs font-medium uppercase text-muted-foreground">
              {liste.length} correction{liste.length > 1 ? "s" : ""}
            </p>
            {confirmer ? (
              <span className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-foreground">Tout effacer ?</span>
                <button
                  type="button"
                  onClick={() => {
                    viderHistorique();
                    setListe([]);
                    setConfirmer(false);
                  }}
                  className="rounded-lg bg-destructive px-3 py-1.5 font-semibold text-white"
                >
                  Oui, effacer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmer(false)}
                  className="rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground"
                >
                  Annuler
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmer(true)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Vider l'historique
              </button>
            )}
          </div>

          <ul className="mt-4 flex flex-col gap-4">
            {liste.map((c) => (
              <li key={c.id}>
                <article className="exercise-sheet overflow-hidden rounded-2xl border border-border">
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-mono text-sm font-bold text-primary">
                        {c.exerciceId ?? "Exercice"}
                      </p>
                      <time
                        dateTime={new Date(c.date).toISOString()}
                        className="text-xs text-muted-foreground"
                      >
                        {formatDate(c.date)}
                      </time>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-banner px-3 py-2 font-mono text-sm text-foreground">
                      {c.question}
                    </p>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-primary">
                        Voir la correction de Jàng
                      </summary>
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                        {c.reponse}
                      </p>
                    </details>
                    <button
                      type="button"
                      onClick={() => setListe(supprimerCorrection(c.id))}
                      className="mt-4 text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-destructive"
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
