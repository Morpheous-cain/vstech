"use client"

/**
 * Auth page — login and registration with email/password and phone OTP.
 */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DarkNavyCard } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const router = useRouter();

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value })),
  });

  const validate = () => {
    if (!form.email.includes("@")) return "Enter a valid email address";
    if (form.password.length < 8) return "Password must be at least 8 characters";
    if (mode === "register") {
      if (!form.name.trim()) return "Name is required";
      if (form.password !== form.confirm) return "Passwords do not match";
    }
    return "";
  };

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError("");
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { error: e } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (e) throw e;
        router.push("/account");
      } else {
        const { error: e } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name, phone: form.phone } } });
        if (e) throw e;
        router.push("/account");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #020B19 0%, #04122B 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-obsidian-deep font-display font-bold">V</span>
            </div>
            <span className="font-display text-2xl text-foreground">VisionTech</span>
          </Link>
          <h1 className="font-display text-3xl text-foreground">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="text-obsidian-steel text-sm mt-1">{mode === "login" ? "Sign in to your account" : "Join VisionTech today"}</p>
        </div>

        <DarkNavyCard>
          {/* Mode toggle */}
          <div className="flex rounded-md border border-obsidian-steel overflow-hidden mb-6">
            {(["login", "register"] as Mode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? "bg-gold text-obsidian-deep" : "text-obsidian-steel hover:text-foreground"}`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <div><label className="text-xs text-obsidian-steel block mb-1">Full Name *</label><Input {...field("name")} placeholder="John Kamau" /></div>
            )}
            <div><label className="text-xs text-obsidian-steel block mb-1">Email Address *</label><Input {...field("email")} type="email" placeholder="john@example.com" /></div>
            {mode === "register" && (
              <div><label className="text-xs text-obsidian-steel block mb-1">Phone Number</label><Input {...field("phone")} type="tel" placeholder="0712 345 678" /></div>
            )}
            <div>
              <label className="text-xs text-obsidian-steel block mb-1">Password *</label>
              <div className="relative">
                <Input {...field("password")} type={show ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-steel hover:text-foreground">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {mode === "register" && (
              <div><label className="text-xs text-obsidian-steel block mb-1">Confirm Password *</label><Input {...field("confirm")} type="password" placeholder="••••••••" /></div>
            )}

            {error && <p className="text-status-cancelled text-sm bg-status-cancelled/10 border border-status-cancelled/20 rounded-md px-3 py-2">{error}</p>}

            <button onClick={submit} disabled={loading} className="btn-gold w-full justify-center py-3 mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </DarkNavyCard>
        <p className="text-center text-xs text-obsidian-steel mt-4">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-gold hover:text-gold-light transition-colors">
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
