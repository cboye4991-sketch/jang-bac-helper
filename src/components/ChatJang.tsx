import { useEffect, useRef, useState, type RefObject } from "react";
import { useServerFn } from "@tanstack/react-start";
import { corriger } from "@/lib/corriger.functions";
import { CORRIGER_URL, corrigerViaSupabase } from "@/lib/corriger-client";
import { DUREE_BAC_BLANC_MS, EXERCICES_BAC } from "@/lib/exercices-bac";
import { arreterVoix, parler, voixDisponible } from "@/lib/voix";
import { ID_VALIDE, lienDefi } from "@/lib/defi";
import { ajouterCorrection } from "@/lib/historique";

type Msg = {
  from: "jang" | "eleve";
  text: string;
  /** Exercice concerné : active 🔊 / 📲 Défi / ✍️ similaire sous la réponse */
  exerciceId?: string;
  similaire?: boolean;
  reussi?: boolean;
};

type BacBlanc = { id: string; debut: number };

// ID d'exercice dans un message élève (« jng pc 7 », « JNG-PC-07 »…), comme le nœud EXTRAIRE_ID de Dify
function idExercice(query: string): string | null {
  const m = query.match(/JNG[\s_-]*PC[\s_-]*0*(\d{1,2})/i);
  return m?.[1] ? `JNG-PC-${m[1].padStart(2, "0")}` : null;
}

const ACCUEIL =
  "Salut ! Envoie l'ID d'un exercice suivi de ta réponse. Exemple : JNG-PC-01 : C = 0,05/500 = 0,0001 mol/L\nBloqué(e) ? Tape l'ID puis « 💡 Indice ». Envie de t'entraîner en conditions d'examen ? « 🎲 Bac blanc ».";
const REFUS =
  "Je ne peux pas corriger ce message. Envoie l'ID d'un exercice de la liste suivi de ta réponse.";
const INDISPO = "Jàng est indisponible pour le moment — réessaie dans une minute";
const TROP_LONG = "La réponse prend trop de temps — réessaie";
const NB_INDICES = 3;

const RUBRIC_TONES: Record<string, string> = {
  "CE QUI EST JUSTE": "text-success",
  "TA PREMIÈRE ERREUR": "text-correction",
  "LA MÉTHODE": "text-subject-maths",
  INDICE: "text-subject-maths",
  "À TOI": "text-subject-physique",
};

function JangReply({ text }: { text: string }) {
  return text.split("\n").map((line, index) => {
    // Retire émojis, puces et ponctuation en tête (« ✅ CE QUI EST JUSTE ») avant de reconnaître la rubrique
    const normalized = line
      .replace(/[*#_:]/g, " ")
      .replace(/^[^\p{L}]+/u, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase(); // Gemini écrit parfois « LA MÉthODE »
    const title = Object.keys(RUBRIC_TONES).find(
      (label) => normalized === label || normalized.startsWith(`${label} `),
    );
    return (
      <span
        key={`${index}-${line}`}
        className={
          title ? `block font-mono text-xs font-medium ${RUBRIC_TONES[title]}` : "block min-h-[1lh]"
        }
      >
        {line || " "}
      </span>
    );
  });
}

function getUserId() {
  const k = "jang-user-id";
  let id = localStorage.getItem(k);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(k, id);
  }
  return id;
}

function formatDuree(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
}

function compteARebours(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const PETIT_BOUTON =
  "inline-flex items-center gap-1 rounded-full border border-primary/40 bg-secondary px-3 py-1 font-sans text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground";

export function ChatJang({
  input,
  setInput,
  inputRef,
  defiId,
}: {
  input: string;
  setInput: (v: string) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  /** Exercice reçu par un lien « Défi WhatsApp » (?ex=JNG-PC-07) */
  defiId?: string | null;
}) {
  const [messages, setMessages] = useState<Msg[]>([{ from: "jang", text: ACCUEIL }]);
  const [loading, setLoading] = useState(false);
  const [indices, setIndices] = useState<Record<string, number>>({});
  const [bac, setBac] = useState<BacBlanc | null>(null);
  const [maintenant, setMaintenant] = useState(() => Date.now());
  const [lecture, setLecture] = useState<number | null>(null);
  const [voixOk, setVoixOk] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const corrigerFn = useServerFn(corriger);

  useEffect(() => setVoixOk(voixDisponible()), []);
  useEffect(() => () => arreterVoix(), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Lien de défi : Jàng présente l'exercice envoyé par le camarade
  useEffect(() => {
    if (!defiId || !ID_VALIDE.test(defiId)) return;
    const ex = EXERCICES_BAC.find((e) => e.id === defiId);
    if (!ex) return;
    setMessages((m) => [
      ...m,
      {
        from: "jang",
        text: `📲 Un camarade te défie sur ${ex.id} (${ex.chapitre}) :\n${ex.enonce}\nDonnées : ${ex.donnees}\nEnvoie ta réponse : ${ex.id} : …`,
      },
    ]);
  }, [defiId]);

  // Compte à rebours du Bac blanc
  useEffect(() => {
    if (!bac) return;
    const t = setInterval(() => setMaintenant(Date.now()), 1000);
    return () => clearInterval(t);
  }, [bac]);

  const restant = bac ? DUREE_BAC_BLANC_MS - (maintenant - bac.debut) : 0;
  const idSaisi = idExercice(input);
  const prochainIndice = idSaisi ? (indices[idSaisi] ?? 0) + 1 : 1;

  function placerCurseur(texte: string) {
    setInput(texte);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      el?.focus();
      el?.setSelectionRange(texte.length, texte.length);
    });
  }

  async function envoyer(query: string) {
    if (!query || loading) return;
    arreterVoix();
    setLecture(null);
    setMessages((m) => [...m, { from: "eleve", text: query }]);
    setInput("");
    setLoading(true);

    const id = idExercice(query);
    const estSimilaire = /\bsimilaire\b/i.test(query);
    const estIndice = /\bindice\b/i.test(query);
    // Bac blanc : la première réponse à l'exercice tiré arrête le chrono
    const finBac = bac && id === bac.id && !estIndice ? Date.now() - bac.debut : null;
    if (finBac !== null) setBac(null);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<"timeout">((r) => {
      timer = setTimeout(() => r("timeout"), 60000);
    });
    const reponse: Msg = { from: "jang", text: INDISPO };
    try {
      const res = await Promise.race([
        CORRIGER_URL
          ? corrigerViaSupabase(query, getUserId())
          : corrigerFn({ data: { query, userId: getUserId() } }),
        timeout,
      ]);
      if (res === "timeout") reponse.text = TROP_LONG;
      else if (res.kind === "ok") {
        reponse.text = res.text;
        ajouterCorrection({ exerciceId: id, question: query, reponse: res.text });
        if (id) {
          reponse.exerciceId = id;
          // ✍️ « J'ai fait l'exercice similaire » seulement sous une vraie correction
          reponse.similaire = !estSimilaire && !estIndice && /À TOI/.test(res.text);
          reponse.reussi = /aucune erreur|tout est juste|chapitre maîtrisé/i.test(res.text);
        }
      } else if (res.kind === "refus") reponse.text = res.message || REFUS;
      else reponse.text = res.detail ? `${INDISPO}.\nDétail technique : ${res.detail}` : INDISPO;
    } catch {
      reponse.text = INDISPO;
    } finally {
      clearTimeout(timer);
    }
    const ajout: Msg[] = [reponse];
    if (finBac !== null) {
      ajout.unshift({
        from: "jang",
        text:
          finBac > DUREE_BAC_BLANC_MS
            ? `⏱ Bac blanc terminé en ${formatDuree(finBac)} — au-delà des 15 min prévues. Le jour du Bac, garde un œil sur l'heure !`
            : `⏱ Bac blanc terminé en ${formatDuree(finBac)} sur 15 min. Voici ta correction :`,
      });
    }
    setMessages((m) => [...m, ...ajout]);
    setLoading(false);
  }

  function demanderIndice() {
    if (!idSaisi || prochainIndice > NB_INDICES) return;
    setIndices((s) => ({ ...s, [idSaisi]: prochainIndice }));
    void envoyer(`${idSaisi} · indice ${prochainIndice}`);
  }

  function lancerBacBlanc() {
    const ex = EXERCICES_BAC[Math.floor(Math.random() * EXERCICES_BAC.length)];
    if (!ex) return;
    setBac({ id: ex.id, debut: Date.now() });
    setMaintenant(Date.now());
    setMessages((m) => [
      ...m,
      {
        from: "jang",
        text: `🎲 BAC BLANC — ${ex.id} · ${ex.chapitre}\n${ex.enonce}\nDonnées : ${ex.donnees}\n⏱ Tu as 15 minutes. Sans indice, comme le jour J. Envoie ta réponse : ${ex.id} : …`,
      },
    ]);
    placerCurseur(`${ex.id} : `);
  }

  function ecouter(i: number, texte: string) {
    if (lecture === i) {
      arreterVoix();
      setLecture(null);
      return;
    }
    setLecture(i);
    parler(texte, () => setLecture((l) => (l === i ? null : l)));
  }

  return (
    <section
      aria-label="Corrige mon exercice"
      className="mx-auto mt-6 w-full max-w-[720px] overflow-hidden rounded-2xl border border-border"
    >
      <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 text-lg"
        >
          📘
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">Corrige mon exercice</p>
          <p className="text-xs opacity-80">{loading ? "Jàng écrit…" : "Jàng · en ligne"}</p>
        </div>
        {bac ? (
          <span
            role="timer"
            aria-label="Temps restant du Bac blanc"
            className={`rounded-full px-3 py-1 font-mono text-sm font-semibold ${restant > 0 ? "bg-primary-foreground/15" : "bg-correction text-white"}`}
          >
            ⏱ {restant > 0 ? compteARebours(restant) : "Temps écoulé"}
          </span>
        ) : null}
      </header>

      <div
        ref={listRef}
        aria-live="polite"
        className="flex max-h-[420px] min-h-[220px] flex-col gap-2 overflow-y-auto bg-chat p-3 sm:p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm leading-relaxed text-foreground shadow-sm ${
              m.from === "eleve"
                ? "self-end rounded-tr-none bg-banner"
                : "self-start rounded-tl-none bg-card"
            }`}
          >
            {m.from === "jang" ? <JangReply text={m.text} /> : m.text}
            {m.from === "jang" && i > 0 && ((voixOk && m.text.length > 100) || m.exerciceId) ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {voixOk && m.text.length > 100 ? (
                  <button
                    type="button"
                    onClick={() => ecouter(i, m.text)}
                    aria-pressed={lecture === i}
                    className={PETIT_BOUTON}
                  >
                    {lecture === i ? "⏹ Arrêter" : "🔊 Écouter"}
                  </button>
                ) : null}
                {m.exerciceId && m.similaire ? (
                  <button
                    type="button"
                    onClick={() => placerCurseur(`${m.exerciceId} · similaire : `)}
                    className={PETIT_BOUTON}
                  >
                    ✍️ J'ai fait l'exercice similaire
                  </button>
                ) : null}
                {m.exerciceId ? (
                  <a
                    href={lienDefi(m.exerciceId, Boolean(m.reussi))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={PETIT_BOUTON}
                  >
                    📲 Défier un camarade
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
        {loading && (
          <div
            className="flex items-center gap-1 self-start rounded-lg rounded-tl-none bg-card px-3 py-3 shadow-sm"
            aria-label="Jàng écrit…"
          >
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.3s]" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border bg-card px-3 pt-3">
        <button
          type="button"
          onClick={demanderIndice}
          disabled={loading || !idSaisi || prochainIndice > NB_INDICES || bac?.id === idSaisi}
          title={idSaisi ? undefined : "Tape d'abord l'ID de l'exercice (ex. JNG-PC-07)"}
          className={`${PETIT_BOUTON} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-secondary disabled:hover:text-primary`}
        >
          💡{" "}
          {prochainIndice > NB_INDICES ? "Plus d'indice" : `Indice ${prochainIndice}/${NB_INDICES}`}
        </button>
        <button
          type="button"
          onClick={lancerBacBlanc}
          disabled={loading || Boolean(bac)}
          className={`${PETIT_BOUTON} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          🎲 Bac blanc · 15 min
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void envoyer(input.trim());
        }}
        className="flex flex-col gap-2 bg-card p-3 sm:flex-row sm:items-end"
      >
        <label htmlFor="chat-input" className="sr-only">
          Ta réponse
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={2}
          maxLength={4000}
          placeholder="JNG-PC-01 : ta réponse…"
          className="min-h-[44px] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
        >
          Envoyer à Jàng
        </button>
      </form>
    </section>
  );
}
