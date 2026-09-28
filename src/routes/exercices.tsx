import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/exercices")({
  head: () => ({
    meta: [
      { title: "Exercices — Jàng" },
      {
        name: "description",
        content:
          "Exercices type Bac sénégalais : chimie, physique, maths. Copie l'ID de ton exercice et envoie ta réponse.",
      },
      {
        property: "og:title",
        content: "Exercices type Bac — Jàng",
      },
      {
        property: "og:description",
        content:
          "Choisis un exercice, copie son ID et envoie ta réponse. Jàng te dit où tu t'es trompé.",
      },
    ],
  }),
  component: Exercices,
});

type Status = "corrige" | "preparation";

interface Exercise {
  id: string;
  subject: "Chimie" | "Physique" | "Maths";
  chapter: string;
  statement: string;
  status: Status;
}

const EXERCISES: Exercise[] = [
  {
    id: "JNG-PC-01",
    subject: "Chimie",
    chapter: "Solutions et pH",
    statement: "2,0 g de NaOH dans 500 mL : calcule C puis le pH",
    status: "corrige",
  },
  {
    id: "JNG-PC-03",
    subject: "Chimie",
    chapter: "Acides faibles",
    statement: "pH d'une solution d'acide éthanoïque à 1,0×10⁻² mol/L (pKa = 4,8)",
    status: "corrige",
  },
  {
    id: "JNG-MA-01",
    subject: "Maths",
    chapter: "Suites numériques",
    statement: "Étudier la convergence d'une suite récurrente",
    status: "preparation",
  },
  {
    id: "JNG-PC-07",
    subject: "Physique",
    chapter: "Lois de Newton",
    statement: "Solide sur un plan incliné à 30° : accélération et vitesse après 2,0 m",
    status: "corrige",
  },
  {
    id: "JNG-PC-10",
    subject: "Physique",
    chapter: "Dipôle RC",
    statement: "R = 10 kΩ, C = 100 µF : constante de temps et tension à t = τ",
    status: "corrige",
  },
  {
    id: "JNG-PC-12",
    subject: "Physique",
    chapter: "Effet photoélectrique",
    statement: "Cellule au césium éclairée à 500 nm : énergie cinétique maximale",
    status: "corrige",
  },
];

const FILTERS = ["Tous", "Chimie", "Physique", "Maths"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_CLASS_ACTIVE =
  "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground";
const FILTER_CLASS_INACTIVE =
  "rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary/10";

function StatusBadge({ status }: { status: Status }) {
  if (status === "corrige") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
        Corrigé disponible
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-destructive" />
      En préparation
    </span>
  );
}

function ExerciseCard({
  exercise,
  copied,
  onCopy,
}: {
  exercise: Exercise;
  copied: boolean;
  onCopy: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-mono text-sm font-bold tracking-wide text-primary">
          {exercise.id}
        </p>
        <StatusBadge status={exercise.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
          {exercise.subject}
        </span>
        <span className="text-xs text-muted-foreground">{exercise.chapter}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{exercise.statement}</p>
      <button
        type="button"
        onClick={() => onCopy(exercise.id)}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
      >
        {copied ? "Copié ✓" : "Copier l'ID"}
      </button>
    </article>
  );
}

function Exercices() {
  const [filter, setFilter] = useState<Filter>("Tous");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyId(id: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(id);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = id;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Copie indisponible sur ce navigateur : l'ID reste visible sur la carte.
    }
  }

  const visible =
    filter === "Tous" ? EXERCISES : EXERCISES.filter((e) => e.subject === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Exercices type Bac
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Choisis ton exercice, copie son ID, puis envoie l'ID et ta réponse.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrer par matière">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={filter === f ? FILTER_CLASS_ACTIVE : FILTER_CLASS_INACTIVE}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {visible.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            copied={copiedId === exercise.id}
            onCopy={copyId}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-8 rounded-2xl border border-border bg-secondary p-6 text-center text-sm text-muted-foreground">
          Aucun exercice dans cette matière pour le moment.
        </p>
      )}

      <p className="mt-10 rounded-2xl bg-secondary p-5 text-sm leading-relaxed text-secondary-foreground">
        <Link to="/contact" className="font-semibold text-primary underline underline-offset-2">
          Tu es professeur ?
        </Link>{" "}
        Aide-nous à valider les corrigés « en préparation » pour tes élèves.
      </p>
    </div>
  );
}
