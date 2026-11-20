import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";
import { request } from "../services/api";
import AuthShell from "../components/AuthShell";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await request("/auth/register", {
        method: "POST",
        body: { username, email, password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.message || "We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-panel-heading">
        <p className="auth-panel-kicker"><span /> Join the frequency</p>
        <h2>Find your frequency.</h2>
        <p>Your next favorite song is better with a few people listening along.</p>
      </div>

      {error && (
        <motion.div className="auth-error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <AlertCircle size={17} />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="signup-username">Username</label>
          <div className="auth-input-wrap">
            <UserRound size={17} />
            <input id="signup-username" name="username" autoComplete="username" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <div className="auth-input-wrap">
            <span className="auth-input-at">@</span>
            <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={17} />
            <input id="signup-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <p className="auth-field-hint">Use a password you’ll remember. You can change it later.</p>
        </div>
        <motion.button type="submit" className="auth-submit" disabled={loading} whileHover={loading ? undefined : { scale: 1.015 }} whileTap={loading ? undefined : { scale: 0.985 }}>
          <span>{loading ? "Finding your people..." : "Create account"}</span>
          {loading ? <LoaderCircle className="auth-spinner" size={19} /> : <ArrowRight size={19} />}
        </motion.button>
      </form>

      <p className="auth-switch">Already have an account? <Link to="/login">Head back in <ArrowRight size={14} /></Link></p>
    </AuthShell>
  );
}

