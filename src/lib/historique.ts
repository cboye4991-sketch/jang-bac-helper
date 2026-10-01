// Historique des corrections, gardé uniquement dans le navigateur de l'élève (aucun serveur).
export type Correction = {
  id: string;
  exerciceId: string | null;
  question: string;
  reponse: string;
  date: number;
};

const CLE = "jang-historique";
const MAX = 50;

export function lireHistorique(): Correction[] {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE) ?? "[]");
    return Array.isArray(brut) ? (brut as Correction[]) : [];
  } catch {
    return [];
  }
}

export function ajouterCorrection(c: Omit<Correction, "id" | "date">): void {
  try {
    const liste = [{ ...c, id: crypto.randomUUID(), date: Date.now() }, ...lireHistorique()];
    localStorage.setItem(CLE, JSON.stringify(liste.slice(0, MAX)));
  } catch {
    // Stockage indisponible (navigation privée…) : l'historique est simplement ignoré.
  }
}

export function supprimerCorrection(id: string): Correction[] {
  const liste = lireHistorique().filter((c) => c.id !== id);
  try {
    localStorage.setItem(CLE, JSON.stringify(liste));
  } catch {
    // Voir ajouterCorrection.
  }
  return liste;
}

export function viderHistorique(): void {
  try {
    localStorage.removeItem(CLE);
  } catch {
    // Voir ajouterCorrection.
  }
}
