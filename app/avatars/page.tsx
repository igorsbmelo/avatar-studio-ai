"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/browser";

type Template=Record<string,any>;
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
const terms:Record<string,string[]>={
 "absurdo":["absurdo","engraçado","comédia","humor","viral","louco","bizarro"],
 "elegante":["elegante","luxo","fashion","chique","executiva","ceo","moda"],
 "engraçado":["engraçado","comédia","humor","absurdo","viral","divertido"],
 "forte":["forte","musculoso","gigante","fitness","atlético","atletico"],
 "curto":["curto","barbeiro","cabelo curto","short"],
 "mulher":["mulher","feminino","feminina","diva","rainha","executiva","ceo"],
 "homem":["homem","masculino","masculina","tio","gigante","criador"],
 "plus-size":["plus-size","plus size","gordo","gorda","corpo grande","curvas"],
 "bowl cut":["bowl cut","tigela","corte tigela"]
};
function recommendationTokens(prompt:string){
 const p=prompt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 const normalized:Record<string,string[]> = {
  absurdo:["absurdo","engracado","comedia","humor","viral","bizarro"],
  elegante:["elegante","luxo","fashion","chique","moda"],
  forte:["forte","musculoso","musculosa","fitness","gigante"],
  "plus-size":["plus-size","plus size","gordo","gorda","corpo grande","curvilinea","curvilineo"],
  mulher:["mulher","feminino","feminina","ela"],
  homem:["homem","masculino","masculina","ele"],
  curto:["cabelo curto","careca","barba curta","corte curto"],
  "bowl cut":["bowl cut","cabelo tigela","corte tigela"]
 };
 return Object.entries(normalized).filter(([,words])=>words.some(w=>p.includes(w))).map(([key])=>key);
}
export default function Avatars(){
 const [templates,setTemplates]=useState<Template[]>([]),[filter,setFilter]=useState(""),[user,setUser]=useState<any>(null),[busy,setBusy]=useState(""),[msg,setMsg]=useState(""),[limit,setLimit]=useState(false),[prompt,setPrompt]=useState(""),[appliedPrompt,setAppliedPrompt]=useState(false);
 useEffect(()=>{(async()=>{const sb=createClient();const [{data:{user}},{data,error}]=await Promise.all([sb.auth.getUser(),sb.from("avatar_templates").select("*").eq("active",true).order("sort_order")]);if(!error)setTemplates((data||[]).filter(isAdult));setUser(user)})()},[]);
 const aiTerms=useMemo(()=>appliedPrompt?recommendationTokens(prompt):[],[appliedPrompt,prompt]);
 const shown=useMemo(()=>{
  let list=templates.filter(t=>!filter||[t.gender,t.style,t.description,t.name,...(Array.isArray(t.tags)?t.tags:[])].join(" ").toLowerCase().includes(filter));
  if(aiTerms.length) list=list.map(t=>{const text=[t.gender,t.style,t.description,t.name,...(Array.isArray(t.tags)?t.tags:[])].join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");const score=aiTerms.reduce((n,k)=>n+((terms[k]||[k]).some(w=>text.includes(w.normalize("NFD").replace(/[\u0300-\u036f]/g,"")))?1:0),0);return {t,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).map(x=>x.t);
  return list;
 },[templates,filter,aiTerms]);
 async function selectAvatar(t:Template){
  const id=String(t.id);setBusy(id);setMsg("");setLimit(false);
  if(!user){window.location.href="/login?next=/avatars";return}
  const sb=createClient();
  const {error}=await sb.from("avatars").insert({user_id:user.id,name:String(t.name||"Avatar adulto"),source_type:"digital",image_path:String(t.thumbnail_url||""),gender:String(t.gender||""),apparent_age:String(t.apparent_age||"Adulto"),style:String(t.style||""),scene:t.scene,status:"draft",safety_status:"pending",appearance_config:{template_id:id,tags:Array.isArray(t.tags)?t.tags:[],style:t.style}});
  if(error){const m=error.message||"Não foi possível usar este avatar.";setMsg(m);if(m.includes("AVATAR_LIMIT_REACHED")||m.includes("Limite de avatares"))setLimit(true)}else{window.location.href="/studio"}
  setBusy("");
 }
 function askAssistant(){setFilter("");setAppliedPrompt(true);if(!recommendationTokens(prompt).length)setMsg("Sugestões do catálogo: tente incluir um estilo, como engraçado, elegante, musculoso, plus-size, cabelo curto ou bowl cut.");else setMsg("Sugestões gratuitas do catálogo organizadas pelo seu pedido. Nenhuma imagem é gerada nem chamada paga é feita.") }
 return <main className="library-shell">
  <nav className="profile-nav"><Link className="brand-logo-link" href="/"><img src="/logo.svg" alt="Avatar Studio AI" style={{width:180}}/></Link><div><Link href="/studio">Meu perfil</Link><Link href="/videos">Vídeos</Link></div></nav>
  <section className="library-head"><div className="section-kicker">🔥 CATÁLOGO DE AVATARES ADULTOS</div><h1>Seu assistente criativo de avatares.</h1><p>Descreva o personagem que você imagina. O assistente gratuito organiza os modelos adultos do catálogo por estilo para ajudar você a começar a criar conteúdo para Reels e TikTok.</p>
   <div className="assistant-panel"><label htmlFor="avatar-idea">O que você quer criar?</label><textarea id="avatar-idea" value={prompt} onChange={e=>{setPrompt(e.target.value);setAppliedPrompt(false)}} placeholder="Ex.: homem negro, musculoso, cabelo engraçado, visual street para vídeos de comédia no TikTok."/><div className="assistant-actions"><button className="hero-primary" onClick={askAssistant}>✦ Encontrar no catálogo</button><Link className="hero-secondary" href="/videos">Escolher vídeos →</Link></div><small>Recomendação local por palavras-chave: usa modelos já existentes no catálogo, sem API paga de geração de imagens. A busca não cria uma imagem inédita.</small></div>
   <div className="filter-pills">{filters.map(([label,value])=><button key={label} className={filter===value?"active":""} onClick={()=>{setFilter(value);setAppliedPrompt(false)}}>{label}</button>)}</div></section>
  {msg&&<div className="catalog-alert" role="status"><b>{limit?"Limite do plano":"Assistente"}</b><span>{msg}</span>{limit&&<Link className="hero-primary" href="/studio/creditos">Ver opções →</Link>}</div>}
  {appliedPrompt&&aiTerms.length>0&&<p style={{maxWidth:1150,margin:"0 auto",padding:"8px 5vw",color:"#b9f3ff"}}>✦ {shown.length} sugestão(ões) encontradas para seu pedido.</p>}
  <section className="library-grid avatar-catalog-grid">{shown.map(t=><article className="avatar-card catalog-avatar-card" key={t.id}><img src={t.thumbnail_url} alt={t.name}/><div className="avatar-shade"/><div className="avatar-info"><span>{t.gender} • {t.style} • {t.tags?.[2]||"Adulto"}</span><h3>{t.name}</h3><button disabled={busy===t.id} onClick={()=>selectAvatar(t)}>{busy===t.id?"Salvando…":"Usar avatar →"}</button></div></article>)}</section>
  {!shown.length&&<p style={{textAlign:"center",color:"#9aa0af",padding:"20px"}}>Ainda não encontramos um modelo compatível. Experimente outra descrição ou escolha uma categoria.</p>}
 </main>
}
