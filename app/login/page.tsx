"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";

const visualImages=["https://images.unsplash.com/photo-1764698072833-dd137d82bbba?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1650666505870-022aab8b1bce?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1664893875908-a1e56db71082?auto=format&fit=crop&w=900&q=85"];

function timeout<T>(promise:Promise<T>,ms:number){return Promise.race([promise,new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error("A conexão demorou mais que o esperado. Tente novamente.")),ms))])}

export default function Login(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[msg,setMsg]=useState(""),[loading,setLoading]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(loading)return;setLoading(true);setMsg("");try{const {error}=await timeout(createClient().auth.signInWithPassword({email:email.trim(),password}),10000);if(error)throw error;const raw=new URLSearchParams(window.location.search).get("next")||"/studio";const next=raw.startsWith("/")&&!raw.startsWith("//")?raw:"/studio";window.location.href=next}catch(error){setMsg(error instanceof Error?error.message:"Não foi possível entrar.")}finally{setLoading(false)}}
 return <main className="form-shell"><section className="signup-visual"><Link className="brand-logo-link" href="/"><img src="/logo.svg" alt="Avatar Studio AI" style={{width:205}}/></Link><h2>Entre no seu <span>Studio.</span></h2><p>Seus avatares, roteiros, vídeos e criações ficam reunidos em um só lugar.</p><div className="signup-mini-grid">{visualImages.map((src,i)=><img key={src} src={src} alt={`Avatar exemplo ${i+1}`}/>)}</div></section><section className="signup-form-side"><form className="form-card" onSubmit={submit}><Link className="back-link" href="/">← Voltar para o início</Link><h1>Entrar</h1><p className="sub">Acesse seu Avatar Studio.</p><label className="input-label" htmlFor="login-email">E-mail</label><input id="login-email" className="input" type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/><label className="input-label" htmlFor="login-password">Senha</label><input id="login-password" className="input" type="password" autoComplete="current-password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button" type="submit" disabled={loading}>{loading?"Entrando…":"Entrar →"}</button>{msg&&<p className="form-msg form-error">{msg}</p>}<p className="sub">Ainda não tem conta? <Link href="/cadastro">Criar conta grátis</Link></p></form></section></main>
}
