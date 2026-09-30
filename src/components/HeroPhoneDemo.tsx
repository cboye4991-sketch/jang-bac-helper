import { useState, type ReactNode } from "react";

export function HeroPhoneDemo() {
  const [replay, setReplay] = useState(0);

  return (
    <div className="mx-auto w-full max-w-[390px]">
      <div key={replay} className="phone-demo relative rounded-[2.25rem] border-[7px] border-foreground bg-foreground p-1 shadow-xl">
        <div className="overflow-hidden rounded-[1.7rem] bg-chat">
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15" aria-hidden>📘</span>
            <div>
              <p className="text-sm font-bold">Jàng</p>
              <p className="text-xs opacity-80">en ligne</p>
            </div>
          </div>

          <div className="relative flex min-h-[490px] flex-col gap-3 p-4 text-[13px] leading-relaxed">
            <div className="demo-student relative ml-auto max-w-[92%] rounded-xl rounded-tr-sm bg-banner px-3 py-2.5 shadow-sm">
              <p className="font-mono text-[12px] font-medium">
                JNG-PC-01 : n = 2/40 = 0,05 mol ; C = <span className="relative inline-block">0,05/500
                  <svg className="demo-circle pointer-events-none absolute -inset-x-2 -inset-y-1 h-[calc(100%+8px)] w-[calc(100%+16px)] overflow-visible" viewBox="0 0 90 30" preserveAspectRatio="none" aria-hidden>
                    <ellipse cx="45" cy="15" rx="43" ry="12" fill="none" stroke="var(--correction)" strokeWidth="2.5" />
                  </svg>
                </span> = 0,0001 mol/L
              </p>
              <span className="demo-note absolute -bottom-7 right-3 rotate-[-5deg] font-hand text-xl font-semibold text-correction">en litres !</span>
            </div>

            <div className="demo-typing mt-5 flex w-fit items-center gap-1 rounded-xl rounded-tl-sm bg-card px-3 py-3 shadow-sm" aria-label="Jàng écrit…">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <span className="ml-1 text-xs text-muted-foreground">Jàng écrit…</span>
            </div>

            <div className="demo-answer mt-5 rounded-xl rounded-tl-sm bg-card px-3 py-3 shadow-sm">
              <CorrectionLine tone="success" title="CE QUI EST JUSTE">Tu as bien calculé la quantité de matière : n = 0,05 mol.</CorrectionLine>
              <CorrectionLine tone="correction" title="TA PREMIÈRE ERREUR">Tu as utilisé 500 au lieu de convertir 500 mL en 0,500 L.</CorrectionLine>
              <CorrectionLine tone="maths" title="LA MÉTHODE">Convertis d'abord : 500 mL = 0,500 L, puis applique C = n/V.</CorrectionLine>
              <CorrectionLine tone="physique" title="À TOI">0,80 g de NaOH dans 250 mL : calcule C puis le pH.</CorrectionLine>
            </div>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => setReplay((n) => n + 1)} className="mx-auto mt-4 block font-mono text-xs font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
        Rejouer la démo
      </button>
    </div>
  );
}

function CorrectionLine({ tone, title, children }: { tone: "success" | "correction" | "maths" | "physique"; title: string; children: ReactNode }) {
  const tones = { success: "text-success", correction: "text-correction", maths: "text-subject-maths", physique: "text-subject-physique" };
  return (
    <div className="mb-3 last:mb-0">
      <p className={`font-mono text-[10px] font-medium ${tones[tone]}`}>{title}</p>
      <p className="mt-0.5 text-foreground">{children}</p>
    </div>
  );
}