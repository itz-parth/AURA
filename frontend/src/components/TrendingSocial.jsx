import { motion } from "framer-motion";
import { Users } from "lucide-react";

const TRENDING = [
  {
    id: 1,
    title: "Chill Vibes 2024",
    subtitle: "Lo-fi beats for late nights",
    image: "https://images.unsplash.com/photo-1459749411477-64901fa6d24e?w=600&h=300&fit=crop",
    listeners: "12.4K listening",
  },
  {
    id: 2,
    title: "Pop Hits",
    subtitle: "Today's biggest tracks",
    image: "https://images.unsplash.com/photo-1493225253777-836379e98652?w=600&h=300&fit=crop",
    listeners: "8.9K listening",
  },
  {
    id: 3,
    title: "Indie Discoveries",
    subtitle: "Fresh indie releases",
    image: "https://images.unsplash.com/photo-1511379938447-cd7fda5b91c8?w=600&h=300&fit=crop",
    listeners: "5.2K listening",
  },
];

const SOCIAL = [
  {
    id: 1,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    name: "Alex",
    action: "is listening to Pop Hits",
    room: "Room #8421",
  },
  {
    id: 2,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    name: "Sam & Jordan",
    action: "are hanging out in a room",
    room: "Room #9102",
  },
  {
    id: 3,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf378f37?w=100&h=100&fit=crop",
    name: "Casey",
    action: "is listening to an R&B playlist",
    room: "Room #3374",
  },
];

export default function TrendingSocial() {
  return (
    <section className="py-20 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Trending section */}
        <div className="mb-16">
          <div className="flex items-center justify-between gap-6 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Currently on repeat 🔥
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRENDING.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-5 flex flex-col h-full group"
              >
                <div className="relative h-36 rounded-xl overflow-hidden mb-4 group relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#080A16] to-transparent">
                    <span className="text-white text-sm font-bold">
                      {item.listeners}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm mb-3">{item.subtitle}</p>
                <button className="w-full py-2 rounded-xl bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:text-aura-cyan transition border border-transparent hover:border-white/20">
                  Join room
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social listening preview */}
        <div className="glass rounded-3xl p-8 lg:p-12 border-white/12">
          <div className="flex items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                People are finding their frequency
              </h2>
              <p className="text-white/50 mt-1">
                Live listening activity across AURA rooms
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Users className="w-4 h-4" />
              <span>Mock activity</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOCIAL.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-transparent hover:border-white/10">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white/10"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-aura-pink rounded-full border-2 border-[#080A16]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-white/50 text-sm">{item.action}</p>
                  <span className="text-xs text-aura-cyan font-medium mt-1 block">
                    {item.room}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
