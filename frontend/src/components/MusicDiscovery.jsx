import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Play } from "lucide-react";

const CATEGORIES = [
  "All",
  "Pop",
  "Hip-Hop",
  "R&B",
  "Chill",
  "Indie",
  "Trending",
];

const TRACKS = [
  {
    id: 1,
    title: "Midnight Drive",
    artist: "Luna Wave",
    image: "/nexus/track-vinyl.webp",
    color: "from-aura-pink to-aura-purple",
  },
  {
    id: 2,
    title: "Neon Nights",
    artist: "Synth City",
    image: "/nexus/track-turntable.webp",
    color: "from-aura-cyan to-aura-purple",
  },
  {
    id: 3,
    title: "Velvet Room",
    artist: "Mira",
    image: "/nexus/track-concert.webp",
    color: "from-aura-purple to-aura-pink",
  },
  {
    id: 4,
    title: "Cloud Nine",
    artist: "Skylar",
    image: "/nexus/track-studio.webp",
    color: "from-aura-cyan to-aura-pink",
  },
  {
    id: 5,
    title: "Echo Chamber",
    artist: "Vibe Theory",
    image: "/nexus/track-pianist.webp",
    color: "from-aura-pink to-aura-cyan",
  },
  {
    id: 6,
    title: "Starlight",
    artist: "Orbit",
    image: "/nexus/track-crowd.webp",
    color: "from-aura-purple to-aura-cyan",
  },
];

export default function MusicDiscovery() {
  const [selected, setSelected] = useState("All");
  return (
    <section className="py-20 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Find your next obsession ✨
            </h2>
            <p className="text-white/50">
              Explore music across genres and discover your next favorite track.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Music className="w-4 h-4" />
            <span>Updated weekly</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selected === cat
                  ? "bg-gradient-to-tr from-aura-pink to-aura-purple text-white shadow-lg shadow-pink-500/25"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-8">
            {TRACKS.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 w-64 group relative"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4 group relative">
                  <div
                    className={`absolute inset-0 rounded-2xl ${track.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-12 h-12 rounded-full bg-aura-pink flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-white group-hover:text-aura-cyan transition-colors">
                  {track.title}
                </h3>
                <p className="text-white/50 text-sm">{track.artist}</p>
                <button className="mt-2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition">
                  <Music className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none gradient fade-start" />
          <div className="absolute inset-0 pointer-events-none gradient fade-end" />
        </div>
      </div>
    </section>
  );
}
