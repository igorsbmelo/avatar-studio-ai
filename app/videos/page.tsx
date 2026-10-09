"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VideoItem={title:string;category:string;meta:string;src:string;emoji:string;custom?:boolean};
const videos:VideoItem[]=[
{title:"Dança no rooftop",category:"Dança",meta:"CIDADE • VERTICAL 9:16",src:"https://videos.pexels.com/video-files/16120732/16120732-uhd_2160_3840_30fps.mp4",emoji:"💃"},
{title:"Dança viral urbana",category:"Dança",meta:"URBANO • VERTICAL 9:16",src:"https://videos.pexels.com/video-files/7571002/7571002-uhd_2160_4096_25fps.mp4",emoji:"🕺"},
{title:"Carro e estrada",category:"Ação",meta:"CARRO • AÇÃO",src:"https://videos.pexels.com/video-files/857267/857267-hd_1920_1080_24fps.mp4",emoji:"🚗"},
{title:"Movimento urbano",category:"Ação",meta:"CIDADE • MOVIMENTO",src:"https://videos.pexels.com/video-files/5873605/5873605-uhd_2160_3840_24fps.mp4",emoji:"🏙️"},
{title:"Fashion em movimento",category:"Elegante",meta:"EDITORIAL • MODA",src:"https://videos.pexels.com/video-files/9512048/9512048-uhd_2160_4096_25fps.mp4",emoji:"👠"},
{title:"Performance absurda",category:"Comédia",meta:"VIRAL • HUMOR",src:"https://videos.pexels.com/video-files/7005842/7005842-hd_1280_720_24fps.mp4",emoji:"😂"},
{title:"Dança com carro esportivo",category:"Dança",meta:"DANÇA • CARRO • VIRAL",src:"https://videos.pexels.com/video-files/16120734/16120734-uhd_2160_3840_30fps.mp4",emoji:"🏎️"},
{title:"Aventura e natureza",category:"Ação",meta:"AVENTURA • EXTERIOR",src:"https://videos.pexels.com/video-files/4188339/4188339-uhd_4096_2160_24fps.mp4",emoji:"🌴"},
{title:"Estrada noturna",category:"Ação",meta:"CARRO • NIGHT DRIVE",src:"https://videos.pexels.com/video-files/5834623/5834623-hd_1920_1080_25fps.mp4",emoji:"🌃"},
{title:"Viagem inesperada",category:"Comédia",meta:"RANDOM • REAÇÃO",src:"https://videos.pexels.com/video-files/5519762/5519762-uhd_3840_2160_30fps.mp4",emoji:"🌎"},
{title:"Música e performance",category:"Música",meta:"PALCO • PERFORMANCE",src:"https://videos.pexels.com/video-files/7646456/7646456-uhd_2160_3840_25fps.mp4",emoji:"🎤"},
{title:"Chegada de impacto",category:"Elegante",meta:"FASHION • EDITORIAL",src:"https://videos.pexels.com/video-files/8468212/8468212-hd_1080_1920_30fps.mp4",emoji:"✨"},
{title:"Futebol — comemoração",category:"Futebol",meta:"ESPORTE • COMEMORAÇÃO",src:"https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4",emoji:"⚽"},
{title:"Futebol — treino",category:"Futebol",meta:"ESPORTE • TREINO",src:"https://videos.pexels.com/video-files/3196296/3196296-hd_1920_1080_25fps.mp4",emoji:"🥅"},
];
function MotionCard({item,onSelect,selected}:{item:VideoItem;onSelect:(item:VideoItem)=>void;selected:boolean}){
 const ref=useRef<HTMLVideoElement>(null);const [muted,setMuted]=useState(true);const [playing,setPlaying]=useState(true);const [failed,setFailed]=useState(false);
 const toggleSound=()=>{const v=ref.current;if(!v)return;v.muted=!v.muted;setMuted(v.muted);v.play().catch(()=>{})};
 const togglePlay=()=>{const v=ref.current;if(!v)return;if(v.paused){v.play().then(()=>setPlaying(true)).catch(()=>{});}else{v.pause();setPlaying(false)}};
 return <article className="video-card video-motion viral-video-card">
  {!failed?<video ref={ref} src={item.src} autoPlay muted loop playsInline preload="metadata" onError={()=>setFailed(true)}/>:<div className="video-fallback"><span>{item.emoji}</span><b>{item.title}</b><small>Prévia indisponível neste momento</small></div>}
  <div className="video-overlay">
   <button className="video-play-btn" onClick={togglePlay} aria-label={playing?"Pausar":"Reproduzir"}>{playing?"Ⅱ":"▶"}</button>
   <div className="video-copy"><b>{item.emoji} {item.title}</b><small>{item.meta}</small><small>{item.category}</small></div>
   <button className="video-sound-btn" onClick={toggleSound} aria-label={muted?"Ativar som":"Silenciar"}>{muted?"🔇":"🔊"}</button>
   <button className="video-buy" onClick={()=>onSelect(item)}>{selected?"✓ Selecionado":"Selecionar vídeo"}</button>
  </div>
 </article>
}
export default function Videos(){
 const [filter,setFilter]=useState("Todos");const [selected,setSelected]=useState("");const [tab,setTab]=useState("biblioteca");const [customUrl,setCustomUrl]=useState("");const [customName,setCustomName]=useState("");const [uploadMsg,setUploadMsg]=useState("");const [customItem,setCustomItem]=useState<VideoItem|null>(null);
 const filters=["Todos","Comédia","Dança","Futebol","Ação","Música","Elegante"];
 useEffect(()=>{try{const saved=window.localStorage.getItem("avatar-studio-selected-video");if(saved)setSelected(JSON.parse(saved).title||"")}catch{}},[]);
 function choose(item:VideoItem){const payload={title:item.title,category:item.category,src:item.src,custom:!!item.custom,selectedAt:new Date().toISOString()};try{window.localStorage.setItem("avatar-studio-selected-video",JSON.stringify(payload));setSelected(item.title);setUploadMsg("Vídeo selecionado neste navegador. Ele fica guardado como referência para a próxima etapa; isso ainda não gera o vídeo final por IA.")}catch{setUploadMsg("Não foi possível guardar a seleção neste navegador.")}}
 function handleUpload(file?:File){if(!file)return;if(!file.type.startsWith("video/")){setUploadMsg("Escolha um arquivo de vídeo válido.");return}if(file.size>100*1024*1024){setUploadMsg("O arquivo deve ter até 100 MB.");return}const url=URL.createObjectURL(file);setCustomUrl(url);setCustomName(file.name);setCustomItem({title:file.name,category:"Meu vídeo",meta:"ARQUIVO LOCAL • REFERÊNCIA",src:url,emoji:"📤",custom:true});setUploadMsg("Prévia local pronta. O arquivo não foi enviado ao servidor; a integração de armazenamento e transformação por IA ainda precisa ser conectada.")}
 const shown=[...videos,...(customItem?[customItem]:[])].filter(v=>filter==="Todos"||v.category===filter);
 return <main className="library-shell">
  <nav className="profile-nav"><Link className="brand-logo-link" href="/"><img src="/logo.svg" alt="Avatar Studio AI" style={{width:180}}/></Link><div><Link href="/studio">Meu perfil</Link><Link href="/avatars">Avatares</Link><Link href="/studio/planos">Planos</Link></div></nav>
  <section className="library-head"><div className="section-kicker">🎬 BIBLIOTECA DE VÍDEOS</div><h1>Escolha o vídeo que combina com seu avatar.</h1><p>Explore referências de comédia, dança, futebol, ação, música e moda. Selecione um clipe ou carregue o seu para visualizar. A seleção é guardada neste navegador; a geração/transformação por IA ainda requer integração.</p><div className="filter-pills">{["biblioteca","incluir"].map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t==="biblioteca"?"🎞️ Biblioteca":"📤 Incluir meu vídeo"}</button>)}</div></section>
  {tab==="biblioteca"?<><section className="library-head" style={{paddingTop:10}}><div className="filter-pills">{filters.map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div>{selected&&<div className="video-audio-note">✓ Selecionado: <b>{selected}</b> <button onClick={()=>{setSelected("");window.localStorage.removeItem("avatar-studio-selected-video")}} style={{marginLeft:12,cursor:"pointer"}}>Limpar</button></div>}{uploadMsg&&<div className="video-audio-note" role="status">{uploadMsg}</div>}</section><section className="video-library-grid">{shown.map((v,i)=><MotionCard item={v} key={v.title+"-"+i} onSelect={choose} selected={selected===v.title}/>)}</section></>:<section className="creator-shell"><div className="section-kicker">📤 VÍDEO DE REFERÊNCIA</div><h2>Inclua seu próprio vídeo.</h2><p>Envie um arquivo para pré-visualizar e selecionar como referência. Por enquanto, ele permanece no navegador e não é enviado para armazenamento nem transformado automaticamente.</p><label className="upload-video-label">Arquivo de vídeo (até 100 MB)<input type="file" accept="video/*" onChange={e=>handleUpload(e.target.files?.[0])} style={{display:"block",marginTop:12,color:"#fff"}}/></label>{customUrl&&<div style={{maxWidth:360,marginTop:24}}><video src={customUrl} controls playsInline style={{width:"100%",borderRadius:16}}/><p>{customName}</p>{customItem&&<button className="hero-primary" onClick={()=>choose(customItem)}>Selecionar como referência →</button>}</div>}{uploadMsg&&<p className="form-msg" role="status">{uploadMsg}</p>}</section>}
 </main>
}
