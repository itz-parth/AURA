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
    image: "https://images.unsplash.com/photo-1493225253777-836379e98652?w=400&h=400&fit=crop",
    color: "from-aura-pink to-aura-purple",
  },
  {
    id: 2,
    title: "Neon Nights",
    artist: "Synth City",
    image: "https://images.unsplash.com/photo-1470225620779-d306dcc4205d?w=400&h=400&fit=crop",
    color: "from-aura-cyan to-aura-purple",
  },
  {
    id: 3,
    title: "Velvet Room",
    artist: "Mira",
    image: "https://images.unsplash.com/photo-1459749411477-64901fa6d24e?w=400&h=400&fit=crop",
    color: "from-aura-purple to-aura-pink",
  },
  {
    id: 4,
    title: "Cloud Nine",
    artist: "Skylar",
    image: "https://images.unsplash.com/photo-1511379938447-cd7fda5b91c8?w=400&h=400&fit=crop",
    color: "from-aura-cyan to-aura-pink",
  },
  {
    id: 5,
    title: "Echo Chamber",
    artist: "Vibe Theory",
    image: "https://images.unsplash.com/photo-1507544847470-9391c684604c?w=400&h=400&fit=crop",
    color: "from-aura-pink to-aura-cyan",
  },
  {
    id: 6,
    title: "Starlight",
    artist: "Orbit",
    image: "https://images.unsplash.com/photo-1465101043530-73397c63e70a?w=400&h=400&fit=crop",
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

        {/* Category pills */}
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

        {/* Horizontal track collection */}
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
          {/* Fade edges for scroll indication */}
          <div className="absolute inset-0 pointer-events-none gradient fade-start" />
          <div className="absolute inset-0 pointer-events-none gradient fade-end" />
        </div>
      </div>
    </section>
  );
}
