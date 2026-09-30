import { createFileRoute, Link } from "@tanstack/react-router";
import { IconAmpoule, IconEnvoyer, IconListe } from "@/components/Illustrations";
import { HeroPhoneDemo } from "@/components/HeroPhoneDemo";

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

function Index() {
  return (
    <div>
      {/* Hero */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 min-[880px]:grid-cols-[1.1fr_.9fr] min-[880px]:items-center min-[880px]:py-20">
          <div>
            <p className="mb-5 font-mono text-xs font-medium uppercase text-primary sm:text-sm">BAC · TERMINALE S2 · PHYSIQUE-CHIMIE</p>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Tu révises seul ? Jàng te montre où tu t'es <span className="relative inline-block">trompé.<svg className="absolute -bottom-2 left-0 h-3 w-full overflow-visible" viewBox="0 0 150 12" preserveAspectRatio="none" aria-hidden><path d="M2 8 C38 2, 100 11, 148 4" fill="none" stroke="var(--correction)" strokeWidth="3" strokeLinecap="round" /></svg></span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Envoie ta réponse à un exercice du Bac, reçois ta première erreur expliquée et un
              exercice pour t'entraîner. Gratuit, sans application à installer.
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
                Je suis professeur
              </Link>
            </div>
            <p className="mt-7 max-w-2xl font-mono text-[11px] font-medium leading-6 text-muted-foreground sm:text-xs">✓ moins de 100 Ko par correction&nbsp;&nbsp; ✓ rien à installer&nbsp;&nbsp; ✓ gratuit pour l'élève</p>
          </div>
          <HeroPhoneDemo />
        </div>
      </section>

      <section className="border-y border-border bg-background/90">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <h2 className="max-w-3xl text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            Les annales, tu les as déjà. Ce qui manque, c'est la correction.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h3 className="text-lg font-bold text-foreground">PDF d'annales du groupe WhatsApp</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li className="flex gap-3"><span className="font-bold text-correction" aria-hidden>✗</span><span>personne ne te dit si ta réponse est juste</span></li>
                <li className="flex gap-3"><span className="font-bold text-correction" aria-hidden>✗</span><span>le corrigé donne tout sans expliquer</span></li>
                <li className="flex gap-3"><span className="font-bold text-correction" aria-hidden>✗</span><span>tu recopies sans comprendre</span></li>
              </ul>
            </article>
            <article className="rounded-lg border-2 border-primary bg-card p-5 sm:p-6">
              <h3 className="text-lg font-bold text-primary">Avec Jàng</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground">
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden>✓</span><span>ta réponse est comparée à un corrigé de référence</span></li>
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden>✓</span><span>seule ta première erreur est expliquée</span></li>
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden>✓</span><span>un exercice similaire pour vérifier</span></li>
              </ul>
            </article>
          </div>
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

      {/* Rappel contact */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Tu es professeur ?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Aide-nous à valider les corrigés pour que les élèves de Terminale révisent avec des
            réponses sûres.
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
