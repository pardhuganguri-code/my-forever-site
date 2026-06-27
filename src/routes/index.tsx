import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Sparkles, Music2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varshu, will you marry me? — From Pardhu" },
      { name: "description", content: "A love letter to Varshu, from the boy who fell for her on the first bench." },
      { property: "og:title", content: "Varshu, will you?" },
      { property: "og:description", content: "Pardhu has something to ask you." },
    ],
  }),
  component: Proposal,
});

const HER = "Varshu";
const ME = "Pardhu";

function Proposal() {
  const [entered, setEntered] = useState(false);
  const [answered, setAnswered] = useState<null | "yes">(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [musicOn, setMusicOn] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    if (musicOn && audioRef.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [musicOn]);

  const enter = () => {
    setEntered(true);
    setMusicOn(true);
  };

  const dodge = () => {
    const x = (Math.random() - 0.5) * 300;
    const y = (Math.random() - 0.5) * 200;
    setNoPos({ x, y });
  };

  const burstHeart = (e: React.MouseEvent) => {
    const id = Date.now() + Math.random();
    const x = e.clientX;
    const y = e.clientY;
    setHearts((h) => [...h, { id, x, y }]);
    setTimeout(() => setHearts((h) => h.filter((p) => p.id !== id)), 1800);
  };

  return (
    <div ref={containerRef} onClick={burstHeart} className="relative min-h-screen overflow-x-hidden">
      {/* Background music — instrumental royalty-free */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/10/30/audio_347111d654.mp3" />

      {/* Ambient starfield */}
      <StarField />

      {/* Floating heart particles on click */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ x: h.x - 12, y: h.y - 12, opacity: 1, scale: 0.6 }}
              animate={{ y: h.y - 180, opacity: 0, scale: 1.4, rotate: (Math.random() - 0.5) * 60 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="fixed"
            >
              <Heart className="h-6 w-6 fill-gold text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Music toggle */}
      {entered && (
        <button
          onClick={(e) => { e.stopPropagation(); setMusicOn((m) => !m); }}
          className="fixed top-6 right-6 z-40 rounded-full border border-gold/40 bg-black/40 p-3 backdrop-blur-md transition hover:border-gold hover:bg-black/60"
          aria-label="Toggle music"
        >
          {musicOn ? <Music2 className="h-4 w-4 text-gold" /> : <VolumeX className="h-4 w-4 text-gold/60" />}
        </button>
      )}

      {/* Envelope intro */}
      <AnimatePresence>
        {!entered && <Envelope onOpen={enter} />}
      </AnimatePresence>

      {entered && (
        <>
          {/* HERO */}
          <motion.section
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mb-6 text-xs uppercase tracking-[0.5em] text-gold/70"
            >
              A letter from {ME}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1.4, ease: "easeOut" }}
              className="font-display text-gold-gradient text-[clamp(3.5rem,14vw,9rem)] leading-[0.95]"
            >
              {HER}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="gold-divider my-8 w-64 origin-center"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1.2 }}
              className="font-display max-w-xl text-2xl italic text-gold-soft/90 md:text-3xl"
            >
              "Every love story is beautiful, but ours is my favorite."
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 1 }}
              className="mt-16 flex flex-col items-center gap-2 text-gold/60"
            >
              <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="h-10 w-px bg-gradient-to-b from-gold to-transparent"
              />
            </motion.div>
          </motion.section>

          {/* THE MOMENT */}
          <Section index="I" title="The Moment I Knew">
            <Typewriter
              text={`It was the first bench of your classroom. You didn't notice me — but I noticed everything. The way the light caught your glasses. The way you tucked your hair behind your ear. The world went quiet, ${HER}, and in that quiet I heard my own heart say: "her."`}
            />
          </Section>

          {/* WHAT YOU ARE */}
          <Section index="II" title={`What You Are To Me`}>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["My first thought", "every morning, before the sun"],
                ["My last smile", "every night, before sleep"],
                ["My favorite sound", "your laugh, even through a phone"],
                ["My quietest courage", "knowing you're somewhere in this world"],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className="group rounded-2xl border border-gold/20 bg-gradient-to-br from-white/[0.03] to-transparent p-6 backdrop-blur-sm transition hover:border-gold/60"
                >
                  <p className="font-display text-2xl text-gold-gradient">{k}</p>
                  <p className="mt-2 text-sm font-light italic text-gold-soft/70">{v}</p>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* PROMISES */}
          <Section index="III" title="My Promises">
            <ul className="space-y-6">
              {[
                "To love you on the loud days and the quiet ones.",
                "To choose you, again and again, even on Tuesdays.",
                "To be your first bench, always — wherever life seats us.",
                "To grow old, slowly, holding your hand a little tighter each year.",
              ].map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  className="flex items-start gap-4 font-display text-xl md:text-2xl"
                >
                  <Sparkles className="mt-2 h-4 w-4 flex-shrink-0 text-gold" />
                  <span className="text-gold-soft/90">{p}</span>
                </motion.li>
              ))}
            </ul>
          </Section>

          {/* THE QUESTION */}
          <section className="relative flex min-h-[110vh] flex-col items-center justify-center px-6 py-32 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="mb-8"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-black/40 backdrop-blur" style={{ animation: "pulse-glow 3s ease-in-out infinite" }}>
                <Heart className="h-8 w-8 fill-gold text-gold" />
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mb-4 text-xs uppercase tracking-[0.5em] text-gold/70"
            >
              And so, {HER},
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 1.2 }}
              className="font-display text-gold-gradient text-5xl leading-tight md:text-7xl"
            >
              Will you marry me?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-6 font-display text-xl italic text-gold-soft/70"
            >
              — {ME}
            </motion.p>

            {!answered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="relative mt-16 flex items-center gap-6"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setAnswered("yes"); }}
                  className="font-display rounded-full bg-gradient-to-br from-[#f5e6a8] via-[#d4af37] to-[#b8860b] px-12 py-5 text-2xl text-ink shadow-[0_10px_40px_rgba(212,175,55,0.5)] transition hover:scale-110"
                  style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
                >
                  Yes, a thousand times
                </button>
                <motion.button
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={dodge}
                  onTouchStart={dodge}
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="font-display rounded-full border border-gold/30 px-6 py-3 text-sm text-gold-soft/60"
                >
                  No
                </motion.button>
              </motion.div>
            )}
          </section>

          <footer className="py-12 text-center text-xs uppercase tracking-[0.4em] text-gold/40">
            Forever yours · {ME}
          </footer>
        </>
      )}

      {/* YES celebration */}
      <AnimatePresence>
        {answered === "yes" && <YesCelebration onClose={() => setAnswered(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Envelope({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background px-6"
    >
      <div className="flex flex-col items-center gap-10 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/60">For</p>
        <h1 className="font-display text-gold-gradient text-5xl md:text-7xl">{HER}</h1>
        <p className="max-w-sm font-display text-lg italic text-gold-soft/70">
          A letter has been waiting for you. Open it when you're ready.
        </p>
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="font-display group relative mt-4 overflow-hidden rounded-full border border-gold/50 bg-black/40 px-10 py-4 text-lg text-gold-soft backdrop-blur transition hover:border-gold"
          style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
        >
          <span className="relative z-10">Open the letter</span>
        </motion.button>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/40">turn your sound on ♪</p>
      </div>
    </motion.div>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="mb-10 flex items-baseline gap-4"
      >
        <span className="font-display text-sm tracking-[0.3em] text-gold/60">{index}</span>
        <div className="gold-divider flex-1" />
        <h2 className="font-display text-gold-gradient text-3xl md:text-4xl">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (shown >= text.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 28);
    return () => clearTimeout(t);
  }, [started, shown, text]);

  return (
    <p
      ref={ref}
      className="font-display text-xl leading-relaxed text-gold-soft/90 md:text-2xl"
    >
      {text.slice(0, shown)}
      <span className="ml-0.5 inline-block h-6 w-[2px] -translate-y-[2px] animate-pulse bg-gold align-middle" />
    </p>
  );
}

function YesCelebration({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 px-6 backdrop-blur-md"
    >
      {/* Confetti hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 3;
          const dur = 4 + Math.random() * 4;
          const size = 12 + Math.random() * 20;
          return (
            <span
              key={i}
              className="absolute bottom-[-50px]"
              style={{
                left: `${left}%`,
                animation: `float-up ${dur}s ${delay}s linear infinite`,
              }}
            >
              <Heart
                className="fill-gold text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                style={{ width: size, height: size }}
              />
            </span>
          );
        })}
      </div>

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        className="relative max-w-xl rounded-3xl border border-gold/40 bg-gradient-to-br from-black/80 to-[#1a1208]/80 p-12 text-center backdrop-blur-xl"
        style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
      >
        <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold/70">
          And just like that
        </p>
        <h2 className="font-display text-gold-gradient mb-6 text-5xl md:text-6xl">
          Forever begins.
        </h2>
        <p className="font-display mb-8 text-xl italic text-gold-soft/90">
          {HER}, you've just made me the happiest man on earth. <br />
          I love you — endlessly, irrevocably, always.
        </p>
        <p className="font-display text-2xl text-gold-gradient">— {ME} ♥ {HER}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="mt-10 text-[10px] uppercase tracking-[0.4em] text-gold/50 hover:text-gold"
        >
          close
        </button>
      </motion.div>
    </motion.div>
  );
}

function StarField() {
  // memoize per-mount
  const stars = useRef(
    Array.from({ length: 70 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 0.5,
      d: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    }))
  ).current;
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            animation: `shimmer ${st.d}s ${st.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
