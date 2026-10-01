import { useEffect, useRef, useState, type RefObject } from "react";
import { useServerFn } from "@tanstack/react-start";
import { corriger } from "@/lib/corriger.functions";
import { CORRIGER_URL, corrigerViaSupabase } from "@/lib/corriger-client";

type Msg = { from: "jang" | "eleve"; text: string; similaireId?: string };

// ID d'exercice dans un message élève (« jng pc 7 », « JNG-PC-07 »…), comme le nœud EXTRAIRE_ID de Dify
function idExercice(query: string): string | null {
  const m = query.match(/JNG[\s_-]*PC[\s_-]*0*(\d{1,2})/i);
  return m?.[1] ? `JNG-PC-${m[1].padStart(2, "0")}` : null;
}

const ACCUEIL =
  "Salut ! Envoie l'ID d'un exercice suivi de ta réponse. Exemple : JNG-PC-01 : C = 0,05/500 = 0,0001 mol/L";
const REFUS =
  "Je ne peux pas corriger ce message. Envoie l'ID d'un exercice de la liste suivi de ta réponse.";
const INDISPO = "Jàng est indisponible pour le moment — réessaie dans une minute";
const TROP_LONG = "La réponse prend trop de temps — réessaie";

const RUBRIC_TONES: Record<string, string> = {
  "CE QUI EST JUSTE": "text-success",
  "TA PREMIÈRE ERREUR": "text-correction",
  "LA MÉTHODE": "text-subject-maths",
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
    const title = Object.keys(RUBRIC_TONES).find((label) => normalized.startsWith(label));
    return (
      <span key={`${index}-${line}`} className={title ? `block font-mono text-xs font-medium ${RUBRIC_TONES[title]}` : "block min-h-[1lh]"}>
        {line || "\u00a0"}
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

export function ChatJang({
  input,
  setInput,
  inputRef,
}: {
  input: string;
  setInput: (v: string) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const [messages, setMessages] = useState<Msg[]>([{ from: "jang", text: ACCUEIL }]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const corrigerFn = useServerFn(corriger);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;
    setMessages((m) => [...m, { from: "eleve", text: query }]);
    setInput("");
    setLoading(true);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<"timeout">((r) => {
      timer = setTimeout(() => r("timeout"), 60000);
    });
    let reply: string;
    let similaireId: string | undefined;
    try {
      const res = await Promise.race([
        CORRIGER_URL
          ? corrigerViaSupabase(query, getUserId())
          : corrigerFn({ data: { query, userId: getUserId() } }),
        timeout,
      ]);
      if (res === "timeout") reply = TROP_LONG;
      else if (res.kind === "ok") {
        reply = res.text;
        // Module D : proposer de vérifier l'exercice « À TOI », sauf si c'était déjà une vérification
        const id = idExercice(query);
        if (id && !/\bsimilaire\b/i.test(query) && /À TOI/.test(res.text)) similaireId = id;
      }
      else if (res.kind === "refus") reply = res.message || REFUS;
      else reply = res.detail ? `${INDISPO}.\nDétail technique : ${res.detail}` : INDISPO;
    } catch {
      reply = INDISPO;
    } finally {
      clearTimeout(timer);
    }
    setMessages((m) => [...m, similaireId ? { from: "jang", text: reply, similaireId } : { from: "jang", text: reply }]);
    setLoading(false);
  }

  return (
    <section
      aria-label="Corrige mon exercice"
      className="mx-auto mt-6 w-full max-w-[720px] overflow-hidden rounded-2xl border border-border"
    >
      <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 text-lg">
          📘
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">Corrige mon exercice</p>
          <p className="text-xs opacity-80">{loading ? "Jàng écrit…" : "Jàng · en ligne"}</p>
        </div>
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
            {m.similaireId && (
              <button
                type="button"
                onClick={() => {
                  const prefixe = `${m.similaireId} · similaire : `;
                  setInput(prefixe);
                  requestAnimationFrame(() => {
                    const el = inputRef.current;
                    el?.focus();
                    el?.setSelectionRange(prefixe.length, prefixe.length);
                  });
                }}
                className="mt-2 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-secondary px-3 py-1 font-sans text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                ✍️ J'ai fait l'exercice similaire
              </button>
            )}
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

      <form onSubmit={send} className="flex flex-col gap-2 border-t border-border bg-card p-3 sm:flex-row sm:items-end">
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
