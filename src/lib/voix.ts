// Réponse vocale : Jàng lit sa correction avec la synthèse vocale du téléphone (Web Speech API).
// Aucune donnée envoyée : la voix est générée sur l'appareil (0 Ko de data).
// Français uniquement : aucune voix wolof n'est promise (tutoriel S5+ §5.2, exclusion linguistique).

export function voixDisponible(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

/** Transforme une correction écrite en texte prononçable (émojis, séparateurs, unités, puissances). */
export function texteAParler(texte: string): string {
  return (
    texte
      .split("\n")
      .filter((l) => !/^[―—–\-\s]+$/.test(l))
      // Titres en capitales (« TA PREMIÈRE ERREUR ») : certaines voix les épellent lettre par lettre
      .map((l) => (/\p{Lu}{4}/u.test(l) && l === l.toUpperCase() ? l.toLowerCase() : l))
      .join(". ")
      .replace(/\p{Extended_Pictographic}|️/gu, "")
      .replace(/JÀNG/g, "Jàng")
      .replace(/JNG-PC-0?(\d+)/g, "exercice $1")
      .replace(/m\/s²/g, " mètres par seconde carrée")
      .replace(/m\/s/g, " mètres par seconde")
      .replace(/mol\/L/g, " moles par litre")
      .replace(/g\/mol/g, " grammes par mole")
      .replace(/×\s*10\^?\s*(-|−|⁻)\s*(\d+)/g, " fois dix puissance moins $2")
      .replace(/×\s*10\^?\s*(\d+)/g, " fois dix puissance $1")
      .replace(
        /\^(-|−)?\s*(\d+)/g,
        (_m, moins: string | undefined, n: string) => ` puissance ${moins ? "moins " : ""}${n}`,
      )
      .replace(/²/g, " au carré")
      .replace(/³/g, " au cube")
      .replace(/√/g, " racine de ")
      .replace(/Δ/g, " delta ")
      .replace(/[×*]/g, " fois ")
      .replace(/·/g, " ")
      .replace(/\s=\s/g, " égale ")
      .replace(/(\w)\s*\/\s*(\w)/g, "$1 sur $2")
      .replace(/\s*\.\s*\./g, ".")
      .replace(/\s+/g, " ")
      .trim()
  );
}

let voixFr: SpeechSynthesisVoice | null = null;
function choisirVoix(): SpeechSynthesisVoice | null {
  if (voixFr) return voixFr;
  const voix = window.speechSynthesis.getVoices();
  voixFr =
    voix.find((v) => v.lang === "fr-FR") ?? voix.find((v) => v.lang.startsWith("fr")) ?? null;
  return voixFr;
}

export function parler(texte: string, onFin: () => void): void {
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(texteAParler(texte));
  u.lang = "fr-FR";
  const v = choisirVoix();
  if (v) u.voice = v;
  u.rate = 0.95;
  u.onend = onFin;
  u.onerror = onFin;
  synth.speak(u);
}

export function arreterVoix(): void {
  if (voixDisponible()) window.speechSynthesis.cancel();
}
