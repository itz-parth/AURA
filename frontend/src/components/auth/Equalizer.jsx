import { motion } from "framer-motion";

const bars = [22, 42, 30, 58, 38, 68, 48, 78, 36, 62, 28, 52, 40, 70, 32, 46];

export default function Equalizer({ compact = false }) {
  return (
    <div className={`auth-equalizer ${compact ? "auth-equalizer--compact" : ""}`} aria-hidden="true">
      {bars.map((height, index) => (
        <motion.span
          key={`${height}-${index}`}
          animate={{ scaleY: [0.45, 1, 0.62] }}
          transition={{
            duration: 1.5 + (index % 4) * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.06,
          }}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
