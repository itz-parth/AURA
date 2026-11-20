import { motion } from "framer-motion";

export default function AudioVisualizer({ isPlaying, videoId }) {
  if (!isPlaying || !videoId) {
    return (
      <div className="flex items-center justify-center h-full text-white/30 text-xs">
        No audio
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1 h-full">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [0.2, 1, 0.4, 0.8, 0.3, 1, 0.5, 0.2],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
          className="w-1.5 bg-gradient-to-t from-aura-pink to-aura-purple rounded-sm transition-all"
          style={{ height: `${40 + i * 8}px` }}
        />
      ))}
    </div>
  );
}
