// Note vocale → texte : dictée du navigateur (Web Speech API, reconnaissance en français).
// L'élève relit toujours le texte avant l'envoi (humain dans la boucle) : rien n'est envoyé à Jàng automatiquement.
// Aucun fichier audio n'est transmis à Dify ni stocké : seul le texte transcrit part, une fois validé.
// Limite : sur Chrome Android, la reconnaissance passe par les serveurs de Google (quelques Ko).

type Resultat = { isFinal: boolean; 0: { transcript: string } };
interface Reconnaissance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<Resultat> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type ConstructeurReconnaissance = new () => Reconnaissance;

function constructeur(): ConstructeurReconnaissance | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstructeurReconnaissance;
    webkitSpeechRecognition?: ConstructeurReconnaissance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function dicteeDisponible(): boolean {
  return constructeur() !== null;
}

// Pas de \b : il ne reconnaît pas les lettres accentuées (« carré ») ; on utilise (?!\p{L}) avec le drapeau u.
const FIN = "(?![\\p{L}])";
const UNITES: [RegExp, string][] = [
  [new RegExp(`mètres? par seconde (?:au )?carrée?s?${FIN}`, "giu"), "m/s²"],
  [new RegExp(`mètres? par seconde${FIN}`, "giu"), "m/s"],
  [new RegExp(`kilomètres? par seconde${FIN}`, "giu"), "km/s"],
  [new RegExp(`moles? par litre${FIN}`, "giu"), "mol/L"],
  [new RegExp(`grammes? par mole${FIN}`, "giu"), "g/mol"],
  [new RegExp(`millilitres?${FIN}`, "giu"), "mL"],
  [new RegExp(`newtons?${FIN}`, "giu"), "N"],
  [new RegExp(`joules?${FIN}`, "giu"), "J"],
  [new RegExp(`becquerels?${FIN}`, "giu"), "Bq"],
];

/** « JNG PC 7 : C égale 0,05 sur 500 » → « JNG-PC-07 : C = 0,05/500 » */
export function versNotation(parle: string): string {
  let t = ` ${parle} `;
  // Identifiant dicté : « j n g p c 7 », « JNG PC sept »…
  const chiffres: Record<string, string> = {
    un: "1",
    deux: "2",
    trois: "3",
    quatre: "4",
    cinq: "5",
    six: "6",
    sept: "7",
    huit: "8",
    neuf: "9",
    dix: "10",
    onze: "11",
    douze: "12",
    treize: "13",
    quatorze: "14",
  };
  t = t.replace(
    /\bj\.?\s*n\.?\s*g\.?[\s-]*p\.?\s*c\.?[\s-]*(\d{1,2}|[a-zé]+)\b/gi,
    (m, n: string) => {
      const num = /^\d+$/.test(n) ? n : chiffres[n.toLowerCase()];
      return num ? ` JNG-PC-${num.padStart(2, "0")} :` : m;
    },
  );
  for (const [re, u] of UNITES) t = t.replace(re, u);
  t = t
    .replace(/(\d)\s+virgule\s+(\d)/giu, "$1,$2")
    // Puissances de 10 d'abord (sinon « fois » et « moins » sont remplacés trop tôt)
    .replace(/\s*(?:fois\s+)?(?:dix|10)\s+puissance\s+moins\s+(\d+)/giu, "×10^-$1")
    .replace(/\s*(?:fois\s+)?(?:dix|10)\s+puissance\s+(\d+)/giu, "×10^$1")
    .replace(/\s+(?:égale?s?|égal à|vaut)\s+/giu, " = ")
    .replace(/\s+(?:divisée? par|sur)\s+/giu, "/")
    .replace(/\s+(?:multipliée? par|fois)\s+/giu, " × ")
    .replace(/\s+plus\s+/giu, " + ")
    .replace(/\s+moins\s+(?=\d)/giu, " − ")
    .replace(/\s+au carré(?![\p{L}])/giu, "²")
    .replace(/\s+au cube(?![\p{L}])/giu, "³")
    .replace(/racine (?:carrée )?de\s+/giu, "√")
    .replace(/(?<![\p{L}])cosinus(?![\p{L}])/giu, "cos")
    .replace(/(?<![\p{L}])sinus(?![\p{L}])/giu, "sin")
    .replace(/\s+point[- ]virgule\s+/giu, " ; ")
    .replace(/\s+deux[- ]points\s+/giu, " : ")
    .replace(/\s+/g, " ")
    .trim();
  return t;
}

export type Dictee = { arreter: () => void };

export function demarrerDictee(cb: {
  /** texte en cours (provisoire puis définitif), déjà converti en notation */
  onTexte: (texte: string, definitif: boolean) => void;
  onFin: () => void;
  onErreur: (message: string) => void;
}): Dictee | null {
  const C = constructeur();
  if (!C) return null;
  const r = new C();
  r.lang = "fr-FR";
  r.continuous = false;
  r.interimResults = true;
  let definitif = "";
  r.onresult = (e) => {
    let provisoire = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (!res) continue;
      if (res.isFinal) definitif += ` ${res[0].transcript}`;
      else provisoire += ` ${res[0].transcript}`;
    }
    const brut = `${definitif} ${provisoire}`.trim();
    cb.onTexte(versNotation(brut), provisoire.trim() === "");
  };
  r.onerror = (e) => {
    const messages: Record<string, string> = {
      "not-allowed":
        "Micro refusé : autorise le micro pour ce site dans les réglages du navigateur.",
      "no-speech": "Je n'ai rien entendu. Réessaie en parlant près du téléphone.",
      network: "Pas de réseau pour la dictée. Tape ta réponse au clavier.",
      "audio-capture": "Aucun micro détecté.",
    };
    cb.onErreur(messages[e.error] ?? "La dictée n'a pas marché. Tape ta réponse au clavier.");
  };
  r.onend = cb.onFin;
  r.start();
  return { arreter: () => r.stop() };
}
