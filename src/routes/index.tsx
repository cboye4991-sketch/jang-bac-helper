import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HeroIllustration,
  IconAmpoule,
  IconEnvoyer,
  IconListe,
} from "@/components/Illustrations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Jàng — Tu révises seul ? Jàng te dit où tu t'es trompé",
      },
      {
        name: "description",
        content:
          "Envoie ta réponse à un exercice du Bac, reçois ta première erreur expliquée et un exercice similaire pour t'entraîner. Gratuit, sans application à installer.",
      },
      {
        property: "og:title",
        content: "Jàng — Correcteur d'exercices du Bac sénégalais",
      },
      {
        property: "og:description",
        content:
          "Envoie ta réponse à un exercice du Bac, reçois ta première erreur expliquée et un exercice similaire. Gratuit, sans application à installer.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    title: "Choisis un exercice",
    body: "Repère l'ID de l'exercice qui t'intéresse dans la liste (ex. JNG-PC-01).",
    Icon: IconListe,
  },
  {
    title: "Envoie l'ID et ta réponse",
    body: "Écris ta réponse comme tu l'aurais fait sur ta copie, depuis ton téléphone.",
    Icon: IconEnvoyer,
  },
  {
    title: "Reçois ta première erreur",
    body: "Jàng te dit où tu t'es trompé, explique la méthode et te donne un exercice similaire.",
    Icon: IconAmpoule,
  },
];

const STATS = [
  { value: "14", label: "exercices type Bac" },
  { value: "14", label: "fiches de cours" },
  { value: "< 100 Ko", label: "par correction" },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-[1.15fr_1fr] sm:items-center sm:py-20">
          <div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Tu révises seul ?{" "}
              <span className="text-primary">Jàng te dit où tu t'es trompé.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Envoie ta réponse à un exercice du Bac, reçois ta première erreur expliquée
              et un exercice pour t'entraîner. Gratuit, sans application à installer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/exercices"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
              >
                Corriger un exercice
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-primary/30 bg-background px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-background/60 sm:text-base"
              >
                Je suis professeur bénévole
              </Link>
            </div>
          </div>
          <HeroIllustration className="mx-auto w-64 max-w-full sm:w-full sm:max-w-sm" />
        </div>
      </section>

      {/* Bannière avantages */}
      <section className="bg-banner">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3 text-sm font-medium text-foreground sm:flex-row sm:justify-center sm:gap-6">
          <span>📶 Moins de 100 Ko par correction</span>
          <span>📱 Aucune application à installer</span>
          <span>🆓 Gratuit pour l'élève</span>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Comment ça marche
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <step.Icon className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Chiffres */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 text-center sm:grid-cols-3 sm:py-14">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rappel contact */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Tu es professeur ?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Aide-nous à valider les corrigés pour que les élèves de Terminale révisent
            avec des réponses sûres.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
