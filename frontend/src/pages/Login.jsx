import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { request } from "../services/api";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await request("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      login(data.access_token, { id: data.id, email: data.email });
      navigate("/nexus");
    } catch (err) {
      setError(err.message || "We couldn't tune you in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-panel-heading">
        <p className="auth-panel-kicker"><span /> Welcome back</p>
        <h2>Ready to tune in?</h2>
        <p>Your rooms, your queue, your people — all right where you left them.</p>
      </div>

      {error && (
        <motion.div className="auth-error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <AlertCircle size={17} />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <div className="auth-input-wrap">
            <span className="auth-input-at">@</span>
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Your secret frequency" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <motion.button type="submit" className="auth-submit" disabled={loading} whileHover={loading ? undefined : { scale: 1.015 }} whileTap={loading ? undefined : { scale: 0.985 }}>
          <span>{loading ? "Tuning in..." : "Enter AURA"}</span>
          {loading ? <LoaderCircle className="auth-spinner" size={19} /> : <ArrowRight size={19} />}
        </motion.button>
      </form>

      <p className="auth-switch">New to the lounge? <Link to="/signup">Create an account <ArrowRight size={14} /></Link></p>
    </AuthShell>
  );
}

