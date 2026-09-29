/**
 * Illustrations SVG dessinées dans le code (aucune image téléchargée).
 * Couleurs : tokens du design system (var(--primary), var(--banner), etc.).
 */

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      className={className}
      role="img"
      aria-label="Illustration : une élève assise avec un cahier et un téléphone Android, d'où sortent deux bulles de chat — une avec une croix, une avec une coche"
    >
      {/* Ombre au sol */}
      <ellipse cx="165" cy="270" rx="125" ry="13" fill="var(--secondary)" />

      {/* Jambes croisées */}
      <ellipse cx="150" cy="234" rx="50" ry="19" fill="var(--foreground)" />
      <ellipse cx="111" cy="238" rx="10" ry="6.5" fill="var(--skin)" />
      <ellipse cx="189" cy="238" rx="10" ry="6.5" fill="var(--skin)" />

      {/* Torse */}
      <rect x="116" y="126" width="68" height="66" rx="26" fill="var(--primary)" />

      {/* Cou */}
      <rect x="142" y="108" width="16" height="22" rx="7" fill="var(--skin)" />

      {/* Tête + cheveux */}
      <circle cx="150" cy="87" r="23" fill="var(--foreground)" />
      <circle cx="150" cy="92" r="19.5" fill="var(--skin)" />

      {/* Bras gauche vers le cahier */}
      <path
        d="M124 150 q -10 18 2 34"
        stroke="var(--primary)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bras droit vers le téléphone */}
      <path
        d="M176 150 q 26 18 28 56"
        stroke="var(--primary)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cahier sur les genoux */}
      <g transform="rotate(-6 150 210)">
        <rect
          x="118"
          y="192"
          width="64"
          height="42"
          rx="5"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <line x1="127" y1="205" x2="172" y2="205" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="127" y1="214" x2="164" y2="214" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="127" y1="223" x2="156" y2="223" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Téléphone Android */}
      <rect x="196" y="166" width="32" height="58" rx="8" fill="var(--foreground)" />
      <rect x="200" y="172" width="24" height="42" rx="4" fill="var(--card)" />
      <line x1="204" y1="182" x2="220" y2="182" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="204" y1="190" x2="216" y2="190" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="204" y1="198" x2="218" y2="198" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="212" cy="220" r="1.8" fill="var(--border)" />

      {/* Main qui tient le téléphone */}
      <circle cx="203" cy="219" r="7" fill="var(--skin)" />

      {/* Bulle 1 : réponse fausse (❌) */}
      <g>
        <path d="M228 140 l -12 26 l 26 -10 Z" fill="var(--card)" stroke="var(--border)" strokeWidth="2" strokeLinejoin="round" />
        <rect x="218" y="98" width="96" height="44" rx="15" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <path
          d="M258 112 l 16 16 M274 112 l -16 16"
          stroke="var(--destructive)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* Bulle 2 : réponse juste (✅) */}
      <g>
        <path d="M256 76 l -16 18 l 28 -4 Z" fill="var(--banner)" />
        <rect x="234" y="38" width="88" height="40" rx="14" fill="var(--banner)" />
        <path
          d="M266 58 l 9 9 l 17 -18"
          stroke="var(--success)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Liste d'exercices : feuille avec lignes */
export function IconListe({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </svg>
  );
}

/** Message envoyé : avion en papier */
export function IconEnvoyer({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

/** Ampoule : l'idée, la méthode */
export function IconAmpoule({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.71.71 1.23 1.52 1.41 2.5" />
    </svg>
  );
}

const SUBJECT_STYLES = {
  Chimie: "text-subject-chimie",
  Physique: "text-subject-physique",
  Maths: "text-subject-maths",
} as const;

/** Petite icône de matière : fiole (Chimie), atome (Physique), sigma (Maths) */
export function SubjectIcon({ subject }: { subject: keyof typeof SUBJECT_STYLES }) {
  const className = `h-4 w-4 shrink-0 ${SUBJECT_STYLES[subject]}`;
  if (subject === "Chimie") {
    return (
      <svg {...ICON_PROPS} strokeWidth={2.2} className={className}>
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
      </svg>
    );
  }
  if (subject === "Physique") {
    return (
      <svg {...ICON_PROPS} strokeWidth={1.7} className={className}>
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
      </svg>
    );
  }
  return (
    <svg {...ICON_PROPS} strokeWidth={2.4} className={className}>
      <path d="M17 4H8l6.5 8L8 20h9" />
    </svg>
  );
}
