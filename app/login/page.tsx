"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";

function timeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("A conexão demorou mais que o esperado. Tente novamente.")), ms)),
  ]);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg("");
    try {
      const { error } = await timeout(
        createClient().auth.signInWithPassword({ email: email.trim(), password }),
        10000,
      );
      if (error) throw error;
      window.location.href = "/studio";
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-shell">
      <section className="signup-visual">
        <Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link>
        <h2>Entre no seu <span>Studio.</span></h2>
        <p>Seus avatares, roteiros, vídeos e criações ficam reunidos em um só lugar.</p>
        <div className="signup-mini-grid">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85" alt="Avatar exemplo 1"/>
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85" alt="Avatar exemplo 2"/>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&q=85" alt="Avatar exemplo 3"/>
        </div>
      </section>
      <section className="signup-form-side">
        <form className="form-card" onSubmit={submit}>
          <Link className="back-link" href="/">← Voltar para o início</Link>
          <h1>Entrar</h1>
          <p className="sub">Acesse seu Avatar Studio.</p>
          <label className="input-label" htmlFor="login-email">E-mail</label>
          <input id="login-email" className="input" type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="input-label" htmlFor="login-password">Senha</label>
          <input id="login-password" className="input" type="password" autoComplete="current-password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="button" type="submit" disabled={loading}>{loading ? "Entrando…" : "Entrar →"}</button>
          {msg && <p className="form-msg form-error">{msg}</p>}
          <p className="sub">Ainda não tem conta? <Link href="/cadastro">Criar conta grátis</Link></p>
        </form>
      </section>
    </main>
  );
}
