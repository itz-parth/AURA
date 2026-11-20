import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

export default function AuthPanel({ children }) {
  return (
    <section className="auth-form-side">
      <motion.div
        className="auth-mobile-brand"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-brand" aria-label="AURA">
          <div className="auth-brand-mark">
            <Music2 size={20} strokeWidth={2.3} />
          </div>
          <span className="auth-brand-name">AURA</span>
        </div>
      </motion.div>
      <motion.div
        className="auth-panel"
        initial={{ opacity: 0, x: 28, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
      <p className="auth-legal">By continuing, you agree to AURA's terms and privacy policy.</p>
    </section>
  );
}
