import AuthVisual from "./auth/AuthVisual";
import AuthPanel from "./auth/AuthPanel";

export default function AuthShell({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-noise" aria-hidden="true" />
      <AuthVisual />
      <AuthPanel>{children}</AuthPanel>
    </main>
  );
}
