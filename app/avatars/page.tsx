"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/browser";

type Template=Record<string,unknown>;
const filters=[["Todos",""],["😂 Absurdos","absurdo"],["✨ Elegantes","elegante"],["🔥 Engraçados","engraçado"],["💪 Fortes","forte"],["✂️ Cabelo curto","curto"],["👑 Femininos","mulher"],["🕺 Masculinos","homem"],["🧍 Plus-size","plus-size"],["⚡ Bowl Cut","bowl cut"]];
function isAdult(t:Template){
 const age=String(t.apparent_age??"").toLowerCase();
 const text=[t.name,t.description,t.style,t.gender,...(Array.isArray(t.tags)?t.tags:[])].join(" ").toLowerCase();
 if(/\b(criança|crianca|infantil|bebê|bebe|kid|child|toddler|teen|adolescente)\b/.test(text))return false;
 const number=Number(age.match(/\d{1,3}/)?.[0]);
 if(Number.isFinite(number)&&number>0&&number<18)return false;
 if(/^(child|kid|infant|toddler|minor|under.?18)$/i.test(age))return false;
 return true;
}
export default function Avatars(){
 const [templates,setTemplates]=useState<Template[]>([]),[filter,setFilter]=useState(""),[user,setUser]=useState<{id:string}|null>(null),[busy,setBusy]=useState(""),[msg,setMsg]=useState(""),[limit,setLimit]=useState(false);
 useEffect(()=>{(async()=>{const sb=createClient();const [{data:{user}},{data,error}]=await Promise.all([sb.auth.getUser(),sb.from("avatar_templates").select("*").eq("active",true).order("sort_order")]);if(!error)setTemplates((data||[]).filter(isAdult));setUser(user)})()},[]);
 const shown=useMemo(()=>templates.filter(t=>!filter||[t.gender,t.style,t.description,t.name,...(Array.isArray(t.tags)?t.tags:[])].join(" ").toLowerCase().includes(filter)),[templates,filter]);
 async function selectAvatar(t:Template){
  const id=String(t.id);setBusy(id);setMsg("");setLimit(false);
  if(!user){window.location.href="/login?next=/avatars";return}
  const sb=createClient();
  const {error}=await sb.from("avatars").insert({user_id:user.id,name:String(t.name||"Avatar adulto"),source_type:"digital",image_path:String(t.thumbnail_url||""),gender:String(t.gender||""),apparent_age:String(t.apparent_age||"Adulto"),style:String(t.style||""),scene:t.scene,status:"draft",safety_status:"pending",appearance_config:{template_id:id,tags:Array.isArray(t.tags)?t.tags:[],style:t.style}});
  if(error){const m=error.message||"Não foi possível usar este avatar.";setMsg(m);if(m.includes("AVATAR_LIMIT_REACHED")||m.includes("Limite de avatares"))setLimit(true)}else{window.location.href="/studio"}
  setBusy("");
 }
 return <main className="library-shell">
  <nav className="profile-nav"><Link className="brand-logo-link" href="/"><img src="/logo.svg" alt="Avatar Studio AI" style={{width:180}}/></Link><div><Link href="/studio">Meu perfil</Link><Link href="/videos">Vídeos</Link></div></nav>
  <section className="library-head"><div className="section-kicker">🔥 CATÁLOGO DE AVATARES ADULTOS</div><h1>Personagens absurdos ou sofisticados.</h1><p>Somente personagens adultos: escolha entre cabelos e barbas exagerados, looks de comédia e visuais elegantes. Diversidade de estilos, tons de pele e tipos físicos.</p><div className="filter-pills">{filters.map(([label,value])=><button key={label} className={filter===value?"active":""} onClick={()=>setFilter(value)}>{label}</button>)}</div></section>
  {msg&&<div className="catalog-alert"><b>Não foi possível selecionar o avatar.</b><span>{msg}</span>{limit&&<Link className="hero-primary" href="/studio/creditos">Comprar +1 avatar — R$ 5 →</Link>}</div>}
  <section className="library-grid avatar-catalog-grid">{shown.map(t=><article className="avatar-card catalog-avatar-card" key={t.id}><img src={t.thumbnail_url} alt={t.name}/><div className="avatar-shade"/><div className="avatar-info"><span>{t.gender} • {t.style} • {t.tags?.[2]||"Adulto"}</span><h3>{t.name}</h3><button disabled={busy===t.id} onClick={()=>selectAvatar(t)}>{busy===t.id?"Salvando…":"Usar avatar →"}</button></div></article>)}</section>
  {!shown.length&&<p style={{textAlign:"center",color:"#9aa0af",padding:"20px"}}>Nenhum avatar adulto encontrado nessa categoria ainda. Escolha outra categoria.</p>}
 </main>
}
