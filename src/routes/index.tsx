import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Jar of Love · For You" },
      { name: "description", content: "A little jar of chits, made just for you." },
      { property: "og:title", content: "A Jar of Love" },
      { property: "og:description", content: "Tap the jar and unfold a tiny surprise." },
    ],
  }),
  component: Index,
});

/* ============================================================
   EDIT YOUR NOTES HERE  ✨
   Each chit has a `kind` that controls its visual style:
   - "sorry"     : apology letter
   - "love-note" : short love note
   - "rose"      : animated glowing rose
   - "bouquet"   : digital bouquet (set bouquetUrl below)
   - "letter"    : long love letter with optional gif
   ============================================================ */

type Chit = {
  kind: "sorry" | "love-note" | "rose" | "bouquet" | "letter";
  title?: string;
  body?: string;
  signature?: string;
  gifUrl?: string;       // optional gif (for letter)
  bouquetUrl?: string;   // link opened from bouquet chit
};

const CHITS: Chit[] = [
  {
    kind: "sorry",
    title: "I'm Sorry",
    body:
      "I didn't mean to hurt you. If i could pay for ur hurted feelings with my love i will pay twice. Please keep this little paper as my promise to do better. sorry again i love you so much i will do better",
    signature: "— Yours, always",
  },
  {
    kind: "love-note",
    title: "A tiny note",
    body: "You make ordinary days feel like soft music. and sometimes rocking jammers but if you are the singer i love every genre 💌",
  },
  {
    kind: "rose",
    title: "A rose, just for you",
    body: "Glowing, because you do.",
  },
  {
    kind: "bouquet",
    title: "A bouquet I made for you",
    // 👉 paste your digital bouquet link here:
    bouquetUrl: "https://digibouquet.vercel.app/bouquet/15e8abbb-affa-4b2a-838b-c71b955880cc",
    body: "Tap to open your bouquet 💐",
  },
  {
    kind: "letter",
    title: "My Love Letter",
    body:
      "From the first hello, something quiet inside me said: this one. Every laugh of yours rearranges my day into something better. Thank you for being mine — in tiny moments and in the big ones too. I love you, today and the day after that, and the one after that. sorry i was just hurt and mad i over did my emotions on you but you still choosing me as your safe place thank you for trusting me m not the best and i wont let any chance to get  better for you i will love you with everythign i got and i will never let you down i promise i will do better for you and for us",
    signature: "— Forever yours",
    // 👉 optional cute gif (leave empty string to hide):
    gifUrl: "https://gifdb.com/images/high/animated-cute-498-x-498-gif-or52yzi6qmbrab3w.gif",
  },
];

/* ============================================================ */

function Index() {
  // opened[i] = true means chit i has been pulled out
  const [opened, setOpened] = useState<boolean[]>(() => CHITS.map(() => false));
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const remaining = useMemo(() => opened.filter((o) => !o).length, [opened]);
  const nextIdx = useMemo(() => opened.findIndex((o) => !o), [opened]);

  const handleJarTap = () => {
    if (activeIdx !== null) return; // a chit is already shown
    if (remaining === 0) {
      // 6th tap → reset
      setOpened(CHITS.map(() => false));
      return;
    }
    if (nextIdx === -1) return;
    setActiveIdx(nextIdx);
  };

  const closeChit = () => {
    if (activeIdx === null) return;
    setOpened((prev) => {
      const next = [...prev];
      next[activeIdx] = true;
      return next;
    });
    setActiveIdx(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-romantic text-foreground">
      {/* soft floating hearts background */}
      <FloatingHearts />

      <header className="relative z-10 pt-10 text-center">
        <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-rose-deep">
          A Jar of Little Things
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Tap the jar — one tiny surprise at a time.
        </p>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-6 pb-16">
        <Jar
          remaining={remaining}
          totalChits={CHITS.length}
          onTap={handleJarTap}
          disabled={activeIdx !== null}
        />

        <p className="mt-6 text-sm text-muted-foreground">
          {remaining > 0
            ? `${remaining} chit${remaining > 1 ? "s" : ""} left · tap the jar`
            : "All opened ✨ tap once more to put them back"}
        </p>
      </section>

      {/* Chit overlay */}
      {activeIdx !== null && (
        <ChitOverlay chit={CHITS[activeIdx]} onClose={closeChit} />
      )}
    </main>
  );
}

/* ---------- Jar ---------- */

function Jar({
  remaining,
  totalChits,
  onTap,
  disabled,
}: {
  remaining: number;
  totalChits: number;
  onTap: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={disabled}
      aria-label="Tap the jar"
      className="group relative outline-none focus-visible:ring-4 focus-visible:ring-rose-soft rounded-full transition-transform active:scale-[0.98]"
    >
      <svg
        viewBox="0 0 240 300"
        width="260"
        height="320"
        className="drop-shadow-[0_20px_30px_rgba(190,80,120,0.25)] transition-transform group-hover:-translate-y-1"
      >
        {/* lid */}
        <rect x="60" y="20" width="120" height="28" rx="8" fill="#d77a9a" />
        <rect x="55" y="40" width="130" height="14" rx="6" fill="#b85c7d" />

        {/* jar body */}
        <defs>
          <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff5f8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ffe2ec" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffd3e0" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="shine" cx="0.3" cy="0.2" r="0.4">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d="M50 70 Q50 56 70 56 H170 Q190 56 190 70 V260 Q190 285 160 285 H80 Q50 285 50 260 Z"
          fill="url(#glass)"
          stroke="#e89bb3"
          strokeWidth="2.5"
        />

        {/* chits inside */}
        <g>
          {Array.from({ length: remaining }).map((_, i) => {
            // arrange chits as small folded papers near the bottom
            const baseY = 240 - i * 14;
            const offsetX = ((i % 3) - 1) * 28;
            const rot = ((i * 37) % 30) - 15;
            const colors = ["#ffd7e0", "#ffe8b0", "#d8f0ff", "#e6d6ff", "#ffd0c2"];
            const c = colors[i % colors.length];
            return (
              <g
                key={i}
                transform={`translate(${120 + offsetX} ${baseY}) rotate(${rot})`}
              >
                <rect
                  x="-18"
                  y="-10"
                  width="36"
                  height="20"
                  rx="3"
                  fill={c}
                  stroke="#c98aa0"
                  strokeWidth="0.8"
                />
                <line x1="-12" y1="-3" x2="12" y2="-3" stroke="#c98aa0" strokeWidth="0.6" />
                <line x1="-12" y1="2" x2="8" y2="2" stroke="#c98aa0" strokeWidth="0.6" />
              </g>
            );
          })}
        </g>

        {/* shine */}
        <ellipse cx="85" cy="110" rx="22" ry="60" fill="url(#shine)" />

        {/* label */}
        <g transform="translate(120 175)">
          <rect x="-46" y="-18" width="92" height="40" rx="6" fill="#fff8f1" stroke="#e89bb3" />
          <text
            textAnchor="middle"
            y="-2"
            fontFamily="Georgia, serif"
            fontSize="12"
            fill="#b85c7d"
          >
            for you
          </text>
          <text
            textAnchor="middle"
            y="14"
            fontFamily="Georgia, serif"
            fontSize="10"
            fill="#c98aa0"
          >
            {remaining}/{totalChits} left
          </text>
        </g>
      </svg>

      {/* gentle pulse ring when interactive */}
      {!disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full animate-pulse-ring"
        />
      )}
    </button>
  );
}

/* ---------- Chit overlay ---------- */

function ChitOverlay({ chit, onClose }: { chit: Chit; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <ChitCard chit={chit} />

        <button
          onClick={onClose}
          className="mt-4 mx-auto block rounded-full bg-white/90 hover:bg-white text-rose-deep px-5 py-2 text-sm font-medium shadow-md transition"
        >
          Tuck it away ♡
        </button>
      </div>
    </div>
  );
}

function ChitCard({ chit }: { chit: Chit }) {
  // Uniform chit size for all notes
  const base =
    "relative mx-auto w-[320px] h-[420px] rounded-2xl shadow-2xl overflow-hidden";

  if (chit.kind === "rose") {
    return (
      <div className={`${base} bg-gradient-to-b from-[#1a0510] to-[#3a0d22] flex flex-col items-center justify-center`}>
        <AnimatedRose />
        <p className="mt-4 font-serif text-rose-100 text-lg">{chit.title}</p>
        <p className="text-rose-200/80 text-sm italic mt-1">{chit.body}</p>
      </div>
    );
  }

  if (chit.kind === "bouquet") {
    return (
      <div className={`${base} bg-gradient-to-br from-[#fff5f8] to-[#ffe2ec] flex flex-col items-center justify-center p-6`}>
        <Bouquet />
        <p className="mt-4 font-serif text-rose-deep text-xl">{chit.title}</p>
        <p className="text-rose-700/70 text-sm mt-1 text-center">{chit.body}</p>
        {chit.bouquetUrl && (
          <a
            href={chit.bouquetUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-full bg-rose-deep text-white px-5 py-2 text-sm font-medium shadow hover:opacity-90 transition"
          >
            Open your bouquet →
          </a>
        )}
      </div>
    );
  }

  if (chit.kind === "love-note") {
    return (
      <div className={`${base} bg-[#fff8f1] p-6 flex flex-col items-center justify-center text-center`}>
        <div className="absolute inset-3 border border-dashed border-rose-300 rounded-xl pointer-events-none" />
        <span className="text-4xl">💌</span>
        <h2 className="mt-3 font-serif text-2xl text-rose-deep">{chit.title}</h2>
        <p className="mt-3 text-rose-900/80 leading-relaxed">{chit.body}</p>
      </div>
    );
  }

  if (chit.kind === "sorry") {
    return (
      <div className={`${base} bg-[#fffaf5] p-6 flex flex-col text-left`}>
        <div className="absolute inset-3 border border-rose-200 rounded-xl pointer-events-none" />
        <h2 className="font-serif text-2xl text-rose-deep">{chit.title}</h2>
        <div className="mt-3 h-px bg-rose-200" />
        <p className="mt-4 text-rose-900/85 leading-relaxed font-serif italic">
          {chit.body}
        </p>
        <p className="mt-auto text-right font-serif text-rose-deep">{chit.signature}</p>
      </div>
    );
  }

  // letter
  return (
    <div className={`${base} bg-[#fffdf7] p-5 flex flex-col`}>
      <div className="absolute inset-3 border border-rose-200 rounded-xl pointer-events-none" />
      <h2 className="font-serif text-xl text-rose-deep text-center">{chit.title}</h2>
      <div className="mt-2 h-px bg-rose-200" />

      {chit.gifUrl && (
        <div className="mt-3 mx-auto w-full h-28 rounded-lg overflow-hidden bg-rose-50 flex items-center justify-center">
          <img
            src={chit.gifUrl}
            alt="A little something"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="mt-3 text-[13px] text-rose-900/85 leading-relaxed font-serif overflow-y-auto pr-1">
        {chit.body}
      </p>
      <p className="mt-2 text-right font-serif text-rose-deep text-sm">{chit.signature}</p>
    </div>
  );
}

/* ---------- Animated rose (SVG) ---------- */

function AnimatedRose() {
  return (
    <svg viewBox="0 0 200 240" width="180" height="220" className="animate-float">
      <defs>
        <radialGradient id="petal" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#ff8bb0" />
          <stop offset="100%" stopColor="#a01640" />
        </radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffb3c8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffb3c8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* glow */}
      <circle cx="100" cy="80" r="70" fill="url(#glow)" className="animate-glow" />

      {/* stem */}
      <path d="M100 110 Q98 160 100 220" stroke="#3a7a3a" strokeWidth="4" fill="none" />
      {/* leaf */}
      <path d="M100 170 Q70 160 60 180 Q85 190 100 180 Z" fill="#4a9a4a" />

      {/* rose petals */}
      <g transform="translate(100 80)">
        <circle r="34" fill="url(#petal)" />
        <path d="M-22 -10 Q0 -34 22 -10 Q0 4 -22 -10 Z" fill="#c52658" />
        <path d="M-18 8 Q0 -18 18 8 Q0 18 -18 8 Z" fill="#e84477" opacity="0.85" />
        <circle r="6" fill="#5a0a22" />
      </g>
    </svg>
  );
}

/* ---------- Bouquet (SVG) ---------- */

function Bouquet() {
  return (
    <svg viewBox="0 0 200 200" width="170" height="170">
      <defs>
        <radialGradient id="b1" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#ffb3c8" />
          <stop offset="100%" stopColor="#c52658" />
        </radialGradient>
        <radialGradient id="b2" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#fff0a8" />
          <stop offset="100%" stopColor="#e8a23a" />
        </radialGradient>
        <radialGradient id="b3" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#e0c8ff" />
          <stop offset="100%" stopColor="#7a4ad2" />
        </radialGradient>
      </defs>

      {/* wrap */}
      <path d="M60 110 L100 200 L140 110 Z" fill="#fff" stroke="#e89bb3" strokeWidth="2" />
      <path d="M70 120 L100 195 L130 120" fill="none" stroke="#e89bb3" strokeWidth="1" />

      {/* leaves */}
      <ellipse cx="70" cy="95" rx="14" ry="22" fill="#5aa55a" transform="rotate(-25 70 95)" />
      <ellipse cx="130" cy="95" rx="14" ry="22" fill="#5aa55a" transform="rotate(25 130 95)" />
      <ellipse cx="100" cy="80" rx="12" ry="20" fill="#4a9a4a" />

      {/* flowers */}
      <circle cx="100" cy="75" r="22" fill="url(#b1)" />
      <circle cx="75" cy="90" r="18" fill="url(#b2)" />
      <circle cx="125" cy="90" r="18" fill="url(#b3)" />
      <circle cx="90" cy="60" r="14" fill="url(#b3)" />
      <circle cx="115" cy="62" r="14" fill="url(#b2)" />

      {/* tie */}
      <rect x="90" y="150" width="20" height="10" rx="3" fill="#b85c7d" />
    </svg>
  );
}

/* ---------- Floating hearts background ---------- */

function FloatingHearts() {
  const hearts = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((_, i) => {
        const left = (i * 73) % 100;
        const delay = (i * 0.7) % 6;
        const dur = 9 + ((i * 1.3) % 6);
        const size = 10 + ((i * 5) % 16);
        return (
          <span
            key={i}
            className="absolute text-rose-300/70 animate-rise"
            style={{
              left: `${left}%`,
              bottom: "-30px",
              fontSize: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          >
            ♥
          </span>
        );
      })}
    </div>
  );
}
