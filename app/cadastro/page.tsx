"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";

const visualImages = [
  "https://images.unsplash.com/photo-1764698072833-dd137d82bbba?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1682310934014-47fbe9d0f3d7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1664893875908-a1e56db71082?auto=format&fit=crop&w=900&q=85",
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://avatar-studio-ai-pemu.vercel.app";

function timeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("A conexão demorou mais que o esperado. Tente novamente.")), ms))]);
}

export default function Cadastro() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(loading)return; setLoading(true); setMsg("");
    try {
      const signupPromise = createClient().auth.signUp({email:email.trim(),password,options:{emailRedirectTo:SITE_URL+"/auth/confirm?next=/studio"}});
      const result = await timeout(signupPromise,10000);
      if(result.error) throw result.error;
      if(result.data?.session){window.location.href="/studio";return;}
      setMsg("Conta criada! Abra o e-mail de confirmação. No celular, o botão agora abrirá o Avatar Studio em vez de localhost.");
    } catch(error){setMsg(error instanceof Error?error.message:"Não foi possível criar sua conta.");}
    finally{setLoading(false);}
  }
  return <main className="form-shell"><section className="signup-visual"><Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link><h2>Crie um personagem que <span>ninguém esquece.</span></h2><p>Comece grátis e transforme uma ideia em avatar, roteiro e vídeo vertical.</p><div className="signup-mini-grid">{visualImages.map((src,i)=><img key={src} src={src} alt={`Avatar exemplo ${i+1}`}/>)}</div></section><section className="signup-form-side"><form className="form-card" onSubmit={submit}><Link className="back-link" href="/">← Voltar para o início</Link><h1>Começar grátis</h1><p className="sub">Crie sua conta em segundos.</p><label className="input-label" htmlFor="email">E-mail</label><input id="email" className="input" type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/><label className="input-label" htmlFor="password">Senha</label><input id="password" className="input" type="password" autoComplete="new-password" minLength={8} placeholder="Mínimo de 8 caracteres" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button" type="submit" disabled={loading}>{loading?"Criando sua conta…":"Criar conta grátis →"}</button>{msg&&<p className={`form-msg ${msg.startsWith("Conta criada")?"":"form-error"}`}>{msg}</p>}<div className="security-note">🛡️ Seus dados ficam protegidos. Nunca compartilhe sua senha.</div><p className="sub">Já possui conta? <Link href="/login">Entrar</Link></p></form></section></main>;
}
