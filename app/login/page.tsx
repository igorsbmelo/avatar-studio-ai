"use client";
import Link from "next/link";
import {useState} from "react";
import {createClient} from "../../lib/supabase/browser";

export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setMsg("Entrando...");const {error}=await createClient().auth.signInWithPassword({email,password});if(error)setMsg(error.message);else window.location.href="/studio";}
 return <main className="site-shell"><nav className="nav"><Link className="brand" href="/">AVATAR STUDIO <span>AI</span></Link></nav><form className="form" onSubmit={submit}><h1>Entrar</h1><p style={{color:"#9298aa"}}>Acesse seu Studio.</p><input className="input" type="email" placeholder="Seu e-mail" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="input" type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button">Entrar</button>{msg&&<p style={{color:"#ff8a00"}}>{msg}</p>}<p style={{color:"#9298aa"}}>Ainda não tem conta? <Link href="/cadastro">Criar conta</Link></p></form></main>;
}