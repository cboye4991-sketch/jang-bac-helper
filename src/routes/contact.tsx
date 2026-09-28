import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Professeur ? Validez les corrigés — Jàng" },
      {
        name: "description",
        content:
          "Aidez-nous à valider les corrigés de Jàng. Contactez l'équipe du projet étudiant GET 409 — Swiss UMEF University, Campus de Dakar.",
      },
      {
        property: "og:title",
        content: "Professeur ? Aidez-nous à valider les corrigés — Jàng",
      },
      {
        property: "og:description",
        content:
          "Contactez l'équipe de Jàng, projet étudiant GET 409 — Swiss UMEF University, Campus de Dakar.",
      },
    ],
  }),
  component: Contact,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9][0-9 ()-]{6,20}$/;

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", message: "" };

const INPUT_CLASS =
  "w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30";
const LABEL_CLASS = "block text-sm font-semibold text-foreground";
const ERROR_CLASS = "mt-1 text-xs text-destructive";

function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = "Indique ton nom complet.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Adresse e-mail invalide.";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim()))
      next.phone = "Numéro invalide (ex. +221 77 000 00 00).";
    if (form.message.trim().length < 10)
      next.message = "Écris quelques mots sur ton établissement et ta disponibilité.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
          <span
            aria-hidden
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-2xl"
          >
            ✓
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
            Merci, {form.name.trim().split(" ")[0]} !
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            L'équipe de Jàng te contactera à l'adresse {form.email.trim()} pour la
            validation des corrigés.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Professeur ? Aidez-nous à valider les corrigés
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Signale une erreur, propose un corrigé ou rejoins l'équipe de validation. Chaque
        corrigé validé profite aux élèves qui révisent seuls.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:col-span-3">
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className={LABEL_CLASS}>
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ex. Awa Diop"
                className={`mt-1.5 ${INPUT_CLASS}`}
              />
              {errors.name && <p className={ERROR_CLASS}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className={LABEL_CLASS}>
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Ex. awa.diop@exemple.sn"
                className={`mt-1.5 ${INPUT_CLASS}`}
              />
              {errors.email && <p className={ERROR_CLASS}>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className={LABEL_CLASS}>
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={25}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Ex. +221 77 000 00 00"
                className={`mt-1.5 ${INPUT_CLASS}`}
              />
              {errors.phone && <p className={ERROR_CLASS}>{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="message" className={LABEL_CLASS}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={1000}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Ton établissement, les matières que tu peux valider, tes disponibilités…"
                className={`mt-1.5 resize-y ${INPUT_CLASS}`}
              />
              {errors.message && <p className={ERROR_CLASS}>{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Envoyer
            </button>
          </div>
        </form>

        <aside className="rounded-2xl bg-secondary p-5 sm:p-6 md:col-span-2">
          <h2 className="text-sm font-bold text-secondary-foreground">Adresse</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Swiss UMEF University
            <br />
            Campus de Dakar
            <br />
            Sénégal
          </p>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Jàng est un projet étudiant : les corrigés sont gratuits et destinés aux
            élèves de Terminale scientifique.
          </p>
        </aside>
      </div>
    </div>
  );
}
