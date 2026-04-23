import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Shield } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import BrandLogo from "../components/layout/BrandLogo";

export default function LoginPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [adminId, setAdminId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    return `${user.slice(0, 2)}***@${domain}`;
  };

  const submitCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email: form.email, password: form.password });
      setAdminId(data.adminId);
      setMaskedEmail(maskEmail(data.email));
      setStep("otp");
      setResendCooldown(30);
    } catch (err) {
      if (!err.response) {
        setError("Unable to reach server. Please try again in a moment.");
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { adminId, otp });
      setSession(data.token, data.admin);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      await api.post("/auth/resend-otp", { adminId });
      setResendCooldown(30);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  const goBack = () => {
    setStep("credentials");
    setOtp("");
    setError("");
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-on-sidebar lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(45,212,191,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(251,146,60,0.2) 0%, transparent 40%)"
          }}
        />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-accent/25 blur-[120px]" />
        <div className="relative z-10"><BrandLogo variant="sidebar" /></div>
        <div className="relative z-10 max-w-md space-y-6">
          <p className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-on-sidebar">
            Craft spaces people remember.
          </p>
          <p className="text-sm leading-relaxed text-on-sidebar-muted">
            Secure console for materials, project media, and leads — tuned for interior and civil workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-sidebar-line bg-white/[0.06] px-4 py-2 text-xs font-medium text-on-sidebar-muted backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-accent" /> OTP-verified login
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-sidebar-line bg-white/[0.06] px-4 py-2 text-xs font-medium text-on-sidebar-muted backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5 text-accent" /> Persistent session
            </span>
          </div>
        </div>
        <p className="relative z-10 text-xs text-on-sidebar-muted">© {new Date().getFullYear()} J&amp;J Infra</p>
      </div>

      <div className="relative flex flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-orange-500/5 lg:hidden" />
        <div className="relative w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:hidden"><BrandLogo /></div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Secure access</p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {step === "credentials" ? "Admin sign in" : "Verify OTP"}
            </h1>
            <p className="mt-2 text-sm text-subtle">
              {step === "credentials"
                ? "Enter your credentials to receive a verification code."
                : `We sent a 6-digit code to ${maskedEmail}`}
            </p>
          </div>

          <Card className="border-line/80 p-6 shadow-lift sm:p-8">
            {error ? (
              <p className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            ) : null}

            {step === "credentials" ? (
              <form className="space-y-4" onSubmit={submitCredentials}>
                <Input label="Email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
                <Input label="Password" type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
                <Button type="submit" className="mt-2 w-full py-3" disabled={loading}>
                  {loading ? "Verifying..." : "Continue"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={submitOtp}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-subtle">Verification Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full rounded-xl border border-line bg-elevated/80 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-ink outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 dark:bg-elevated/50"
                    autoFocus
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-3" disabled={loading || otp.length !== 6}>
                  {loading ? "Verifying..." : "Sign in"}
                </Button>
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={goBack}
                    className="inline-flex items-center gap-1 text-sm font-medium text-subtle hover:text-ink transition">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button type="button" onClick={resendOtp} disabled={resendCooldown > 0}
                    className={`text-sm font-medium transition ${resendCooldown > 0 ? "text-subtle cursor-not-allowed" : "text-accent hover:underline"}`}>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
