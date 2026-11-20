import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import FloatingDock from "../components/FloatingDock";
import JoinFrequencyModal from "../components/JoinFrequencyModal";
import MusicDiscovery from "../components/MusicDiscovery";
import TrendingSocial from "../components/TrendingSocial";

const HERO_ARTWORK = [
  {
    id: "main",
    image: "/nexus/hero-stage.webp",
    w: "w-64 h-64",
    top: "top-24",
    left: "left-1/2 -translate-x-1/2",
    delay: "0s",
  },
  {
    id: "top-left",
    image: "/nexus/hero-guitar-silhouette.webp",
    w: "w-40 h-40",
    top: "top-10 left-10",
    left: "",
    delay: "0.5s",
  },
  {
    id: "top-right",
    image: "/nexus/hero-concert-singer.webp",
    w: "w-40 h-40",
    top: "top-16 right-10",
    left: "",
    delay: "1s",
  },
  {
    id: "bottom-left",
    image: "/nexus/hero-band.webp",
    w: "w-32 h-32",
    top: "bottom-24 left-12",
    left: "",
    delay: "1.5s",
  },
  {
    id: "bottom-right",
    image: "/nexus/hero-festival.webp",
    w: "w-48 h-48",
    top: "bottom-20 right-12",
    left: "",
    delay: "2s",
  },
];

export default function Nexus() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="ambient-light" />

      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-aura-pink/20 rounded-full blur-3xl floating"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-aura-purple/20 rounded-full blur-3xl floating floating-delay-1"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 right-1/5 w-64 h-64 bg-aura-cyan/15 rounded-full blur-2xl floating floating-delay-2"
        style={{ animationDelay: "4s" }}
      />

      <main className="relative z-10 pt-20 pb-32 px-6 lg:px-12">
        <section className="relative max-w-7xl mx-auto min-h-[70vh] flex flex-col lg:flex-row items-center justify-between gap-12 px-4 lg:px-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 max-w-[560px] z-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-aura-pink mb-6">
              YOUR MUSIC. YOUR PEOPLE. YOUR FREQUENCY.
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 text-gradient">
              Music sounds better together.
            </h1>
            <p className="text-white/60 text-lg lg:text-xl mb-10 leading-relaxed">
              Find your people, share your favourite tracks and get lost in
              music together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="btn-gradient text-white font-bold py-5 px-10 rounded-full flex items-center justify-center gap-3 text-lg hover:scale-105 transition-transform"
              >
                JOIN THE FREQUENCY <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="py-5 px-10 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Already have an account?
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex-1 relative h-[520px] lg:h-[640px] flex items-center justify-center z-10"
          >
            {HERO_ARTWORK.map((art) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: parseFloat(art.delay),
                }}
                className={`absolute rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${art.w} ${art.top} ${art.left} group`}
              >
                <img
                  src={art.image}
                  alt={`Artwork ${art.id}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A16]/80 to-transparent opacity-60" />
              </motion.div>
            ))}
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-aura-pink to-aura-purple opacity-80 blur-xl animate-pulse" />
          </motion.div>
        </section>

        <MusicDiscovery />

        <TrendingSocial />
      </main>

      <FloatingDock active={location.pathname} />

      <JoinFrequencyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
