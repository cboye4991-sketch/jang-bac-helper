import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/conseils")({
  head: () => ({
    meta: [
      { title: "Conseils de révision — Jàng" },
      {
        name: "description",
        content:
          "Méthodes simples pour réviser le Bac : s'entraîner sur des exercices, comprendre ses erreurs, rédiger proprement et gérer son temps.",
      },
      { property: "og:title", content: "Conseils de révision pour le Bac — Jàng" },
      {
        property: "og:description",
        content: "Réviser mieux, pas plus : des méthodes concrètes pour progresser en sciences.",
      },
    ],
  }),
  component: Conseils,
});

const CONSEILS = [
  {
    titre: "Fais des exercices, ne relis pas seulement ton cours",
    texte:
      "Relire donne l'impression de savoir, mais seul un exercice montre ce que tu sais vraiment faire. Après chaque chapitre, résous au moins un exercice sans regarder ton cours, puis vérifie.",
  },
  {
    titre: "Cherche ta première erreur",
    texte:
      "Dans un calcul faux, une seule erreur au début fausse tout le reste. Relis ta copie ligne par ligne jusqu'à la première ligne fausse : c'est elle qu'il faut comprendre. C'est exactement ce que Jàng t'indique.",
  },
  {
    titre: "Écris tes unités et ta formule",
    texte:
      "Pose toujours la formule, remplace par les valeurs avec leurs unités, puis calcule. En physique et en chimie, beaucoup d'erreurs viennent d'une conversion oubliée (mL en L, g en mol, nm en m).",
  },
  {
    titre: "Refais l'exercice qui t'a posé problème",
    texte:
      "Une erreur corrigée mais jamais retravaillée revient le jour de l'examen. Quelques jours plus tard, refais le même type d'exercice. Jàng te propose un exercice similaire pour cela.",
  },
  {
    titre: "Fais le point sur tes erreurs fréquentes",
    texte:
      "Note tes erreurs dans un petit carnet : signe oublié, mauvais arrondi, formule confondue. Relis-le avant chaque devoir. Ton historique Jàng te permet de retrouver facilement les corrections passées.",
  },
  {
    titre: "Entraîne-toi au temps réel",
    texte:
      "Une fois par semaine, résous un sujet complet en conditions d'examen : chronomètre lancé, sans cours, sans téléphone. Tu apprends à répartir ton temps et à ne pas rester bloqué sur une seule question.",
  },
  {
    titre: "Révise en petites séances régulières",
    texte:
      "Trente à quarante-cinq minutes concentrées, avec une courte pause, valent mieux qu'une longue nuit de révision. Prévois les matières difficiles quand tu es le plus en forme.",
  },
  {
    titre: "Dors et mange avant l'épreuve",
    texte:
      "La veille d'une épreuve, fais seulement un survol de tes fiches et couche-toi à une heure raisonnable. Un cerveau reposé calcule mieux qu'un cerveau fatigué qui a tout relu.",
  },
] as const;

function Conseils() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Conseils de révision
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Quelques méthodes simples pour préparer le Bac. Choisis-en une ou deux et applique-les cette
        semaine, c'est plus efficace que de tout changer d'un coup.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        {CONSEILS.map((c, i) => (
          <li key={c.titre}>
            <article className="exercise-sheet rounded-2xl border border-border p-5">
              <p className="font-mono text-xs font-medium uppercase text-correction">
                Conseil {i + 1}
              </p>
              <h2 className="mt-1 text-base font-bold text-foreground sm:text-lg">{c.titre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{c.texte}</p>
            </article>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl bg-secondary p-5 text-sm leading-relaxed text-secondary-foreground">
        Prêt à t'entraîner ?{" "}
        <Link to="/exercices" className="font-semibold text-primary underline underline-offset-2">
          Choisis un exercice
        </Link>{" "}
        et envoie ta réponse à Jàng.
      </div>
    </div>
  );
}
