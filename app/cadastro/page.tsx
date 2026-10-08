"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";

const visualImages = [
  "https://images.unsplash.com/photo-1764698072833-dd137d82bbba?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1650666505870-022aab8b1bce?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1589117625454-f4208f405710?auto=format&fit=crop&w=900&q=85",
];

function timeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("A conexão com o servidor demorou mais que o esperado. Tente novamente em alguns segundos.")), ms)
    ),
  ]);
}

export default function Cadastro() {
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
      const supabase = createClient();
      const origin = window.location.origin;

      const { data, error } = await timeout(
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: origin + "/auth/callback?next=/onboarding",
          },
        }),
        10000,
      );

      if (error) throw error;

      if (data.session) {
        window.location.href = "/studio";
        return;
      }

      setMsg("Conta criada! Enviamos a confirmação para seu e-mail. Verifique também a caixa de spam.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar sua conta.";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-shell">
      <section className="signup-visual">
        <Link className="brand-mark" href="/">
          <span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b>
        </Link>
        <h2>Crie um personagem que <span>ninguém esquece.</span></h2>
        <p>Comece grátis e transforme uma ideia em avatar, roteiro e vídeo vertical. A experiência completa começa aqui.</p>
        <div className="signup-mini-grid">
          {visualImages.map((src, i) => (
            <img key={src} src={src} alt={`Avatar exemplo ${i + 1}`} />
          ))}
        </div>
      </section>

      <section className="signup-form-side">
        <form className="form-card" onSubmit={submit}>
          <Link className="back-link" href="/">← Voltar para o início</Link>
          <h1>Começar grátis</h1>
          <p className="sub">Crie sua conta em segundos.</p>

          <label className="input-label" htmlFor="email">E-mail</label>
          <input id="email" className="input" type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={e => setEmail(e.target.value)} required />

          <label className="input-label" htmlFor="password">Senha</label>
          <input id="password" className="input" type="password" autoComplete="new-password" minLength={8} placeholder="Mínimo de 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Criando sua conta…" : "Criar conta grátis →"}
          </button>

          {msg && <p className={`form-msg ${msg.startsWith("Conta criada") ? "" : "form-error"}`}>{msg}</p>}

          <div className="security-note">🛡️ Seus dados ficam protegidos. Nunca compartilhe sua senha.</div>
          <p className="sub">Já possui conta? <Link href="/login">Entrar</Link></p>
        </form>
      </section>
    </main>
  );
}
