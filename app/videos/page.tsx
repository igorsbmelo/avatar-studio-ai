"use client";
import Link from "next/link";
import { useRef, useState } from "react";

const videos=[
["Dança no rooftop","DANÇA • CIDADE • 9:16","https://videos.pexels.com/video-files/16120732/16120732-uhd_2160_3840_30fps.mp4","💃"],
["Carro + estrada","VIAGEM • CARRO • 9:16","https://videos.pexels.com/video-files/857267/857267-hd_1920_1080_24fps.mp4","🚗"],
["Movimento urbano","AÇÃO • CIDADE • 9:16","https://videos.pexels.com/video-files/5873605/5873605-uhd_2160_3840_24fps.mp4","🏙️"],
["Viagem de avião","VIAGEM • AVIÃO • 9:16","https://videos.pexels.com/video-files/8468212/8468212-hd_1080_1920_30fps.mp4","✈️"],
["Fashion em movimento","FASHION • STREET • 9:16","https://videos.pexels.com/video-files/7646456/7646456-uhd_2160_3840_25fps.mp4","🕺"],
["Natureza + aventura","AVENTURA • VIAGEM • 9:16","https://videos.pexels.com/video-files/4188339/4188339-uhd_4096_2160_24fps.mp4","🌴"],
["Performance aleatória","VIRAL • PERFORMANCE • 9:16","https://videos.pexels.com/video-files/7005842/7005842-hd_1280_720_24fps.mp4","🔥"],
["Estrada noturna","CARRO • NIGHT DRIVE • 9:16","https://videos.pexels.com/video-files/5834623/5834623-hd_1920_1080_25fps.mp4","🌃"],
["Dança + carro esportivo","DANÇA • CARRO • VIRAL","https://videos.pexels.com/video-files/16120734/16120734-uhd_2160_3840_30fps.mp4","🏎️"],
["Viagem inesperada","RANDOM • TRAVEL • VIRAL","https://videos.pexels.com/video-files/5519762/5519762-uhd_3840_2160_30fps.mp4","🌎"],
];

function MotionCard({item}:{item:string[]}){
 const ref=useRef<HTMLVideoElement>(null);
 const [muted,setMuted]=useState(true);
 const [playing,setPlaying]=useState(true);
 const [failed,setFailed]=useState(false);
 const [title,meta,src,emoji]=item;
 function toggleSound(){
  const v=ref.current;if(!v)return;
  v.muted=!v.muted;setMuted(v.muted);v.play().catch(()=>{});
 }
 function togglePlay(){
  const v=ref.current;if(!v)return;
  if(v.paused){v.play();setPlaying(true)}else{v.pause();setPlaying(false)}
 }
 return <article className="video-card video-motion viral-video-card">
  {!failed?<video ref={ref} src={src} autoPlay muted loop playsInline preload="metadata" onError={()=>setFailed(true)}/>:<div className="video-fallback"><span>{emoji}</span><b>{title}</b><small>Prévia indisponível • toque para abrir</small></div>}
  <div className="video-overlay">
   <button className="video-play-btn" onClick={togglePlay} aria-label={playing?"Pausar":"Reproduzir"}>{playing?"Ⅱ":"▶"}</button>
   <div className="video-copy"><b>{emoji} {title}</b><small>{meta}</small></div>
   <button className="video-sound-btn" onClick={toggleSound} aria-label={muted?"Ativar som":"Silenciar"}>{muted?"🔇":"🔊"}</button>
  </div>
 </article>
}

export default function Videos(){
 const [filter,setFilter]=useState("Todos");
 const filters=["Todos","🔥 Viral","💃 Dança","🚗 Carros","✈️ Viagens","🏙️ Cidades","🌎 Random"]; const keys=["","VIRAL","DANÇA","CARRO","VIAGEM","CIDADE","RANDOM"];
 return <main className="library-shell">
  <nav className="profile-nav"><Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link><div><Link href="/studio">Meu perfil</Link><Link href="/avatars">Avatares</Link></div></nav>
  <section className="library-head">
   <div className="section-kicker">🎬 BIBLIOTECA VIRAL</div>
   <h1>Vídeos que parecem ter saído do TikTok.</h1>
   <p>Dança, ação, carros, aviões, viagens, cidades, lugares diferentes e ideias completamente aleatórias. Tudo pensado para Reels, TikTok e Shorts.</p>
   <div className="filter-pills">{filters.map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div>
   <div className="video-audio-note">🔊 <b>Som:</b> os navegadores bloqueiam autoplay com áudio. O vídeo começa em movimento e você toca no botão 🔊 para ouvir o som original.</div>
  </section>
  <section className="video-library-grid">{videos.filter(v=>!filter || filter==="Todos" || v[1].includes(keys[filters.indexOf(filter)])).map(v=><MotionCard item={v} key={v[0]}/>)}</section>
 </main>
}