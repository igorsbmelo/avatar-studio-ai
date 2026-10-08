"use client";
import Link from "next/link";
import {useState} from "react";
import {createClient} from "../../lib/supabase/browser";

export default function Cadastro(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setMsg("Criando sua conta...");const {error}=await createClient().auth.signUp({email,password,emailRedirectTo:window.location.origin+"/auth/callback"});if(error)setMsg(error.message);else setMsg("Conta criada. Verifique seu e-mail para continuar.");}
 return <main className="site-shell"><nav className="nav"><Link className="brand" href="/">AVATAR STUDIO <span>AI</span></Link></nav><form className="form" onSubmit={submit}><h1>Começar grátis</h1><p style={{color:"#9298aa"}}>Crie sua conta de teste.</p><input className="input" type="email" placeholder="Seu e-mail" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="input" type="password" minLength={8} placeholder="Senha (mín. 8 caracteres)" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button">Criar conta</button>{msg&&<p style={{color:"#00d4ff"}}>{msg}</p>}<p style={{color:"#9298aa"}}>Já possui conta? <Link href="/login">Entrar</Link></p></form></main>;
}