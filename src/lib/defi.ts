// Défi WhatsApp : un lien wa.me pré-rempli que l'élève envoie elle-même (aucun envoi automatique).
// Le lien ouvre Jàng directement sur l'exercice (paramètre ?ex=). Aucune donnée personnelle dans le message.

export const ID_VALIDE = /^JNG-PC-\d{2}$/;

export function urlExercice(id: string): string {
  const base = typeof window === "undefined" ? "" : window.location.origin;
  return `${base}${import.meta.env.BASE_URL}exercices/?ex=${encodeURIComponent(id)}`;
}

export function lienDefi(id: string, reussi: boolean): string {
  const texte = reussi
    ? `📘 Défi Jàng : je viens de réussir l'exercice ${id} du Bac. À toi de le faire ! ${urlExercice(id)}`
    : `📘 Défi Jàng : je m'entraîne sur l'exercice ${id} du Bac. Tu le fais avec moi ? ${urlExercice(id)}`;
  return `https://wa.me/?text=${encodeURIComponent(texte)}`;
}
