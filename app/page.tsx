import Link from "next/link";

const A = {
  manBowl: "https://images.unsplash.com/photo-1764698072833-dd137d82bbba?auto=format&fit=crop&w=1200&q=88",
  manShort: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1200&q=88",
  womanShort: "https://images.unsplash.com/photo-1682310934014-47fbe9d0f3d7?auto=format&fit=crop&w=1200&q=88",
  womanPlus: "https://images.unsplash.com/photo-1664893875908-a1e56db71082?auto=format&fit=crop&w=1200&q=88",
  womanFashion: "https://images.unsplash.com/photo-1664894626773-ef2687c14bc4?auto=format&fit=crop&w=1200&q=88",
  barber: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1200&q=88",
  womanRed: "https://images.unsplash.com/photo-1764698072833-dd137d82bbba?auto=format&fit=crop&w=1200&q=88",
  manPlus: "https://images.unsplash.com/photo-1664893875908-a1e56db71082?auto=format&fit=crop&w=1200&q=88",
};

const avatars = [
  ["O Gigante Bowl Cut","HOMEM • FORTE • PLATINUM",A.manBowl],
  ["A Rainha Geométrica","MULHER • CURTO • ROSA",A.womanShort],
  ["O Tio Cyber","HOMEM • CURTO • AZUL",A.manShort],
  ["A Diva Plus","MULHER • PLUS-SIZE • FASHION",A.womanPlus],
  ["O Baixinho Fashion","HOMEM • CURTO • EDITORIAL",A.manShort],
  ["A Executiva Bowl","MULHER • CURTO • BOWL CUT",A.womanFashion],
  ["O Gigante Street","HOMEM • MUSCULOSO • STREET",A.manBowl],
  ["A Rebelde Vermelha","MULHER • CURTO • VERMELHO",A.womanRed],
  ["O Criador Plus","HOMEM • PLUS-SIZE • MODERNO",A.manPlus],
  ["A CEO Improvável","MULHER • CURTO • LUXO",A.womanFashion],
];

const videos = [
  {title:"Dança Viral",meta:"15s • 9:16",src:"https://videos.pexels.com/video-files/7571002/7571002-uhd_2160_4096_25fps.mp4"},
  {title:"Fashion em Movimento",meta:"13s • 9:16",src:"https://videos.pexels.com/video-files/9512048/9512048-uhd_2160_4096_25fps.mp4"},
  {title:"Performance",meta:"30s • 9:16",src:"https://videos.pexels.com/video-files/7571002/7571002-uhd_2160_4096_25fps.mp4"},
];

export default function Home() {
  return <main className="landing">
    <nav className="landing-nav">
      <Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link>
      <div className="nav-links"><a href="#avatares">Avatares</a><a href="#videos">Vídeos</a><a href="#como">Como funciona</a><Link href="/login">Entrar</Link><Link className="nav-cta" href="/cadastro">Começar grátis</Link></div>
    </nav>

    <section className="hero-rich">
      <div className="hero-copy">
        <div className="eyebrow-pill">✦ IA PARA CRIADORES</div>
        <h1>Crie um avatar que <span>ninguém esquece.</span></h1>
        <p>Personagens fortes, engraçados, plus-size, cabelos curtos e combinações completamente inesperadas. Depois transforme tudo em vídeos verticais.</p>
        <div className="hero-actions"><Link className="hero-primary" href="/cadastro">Criar meu avatar grátis →</Link><Link className="hero-secondary" href="#avatares">Explorar avatares ▶</Link></div>
        <div className="trust-row"><span>⚡ Criação rápida</span><span>🎨 100+ estilos</span><span>📱 Reels • TikTok • Shorts</span></div>
      </div>
      <div className="hero-collage">
        <div className="glow glow-a"/><div className="glow glow-b"/>
        <div className="hero-photo hero-photo-main"><img src={A.manBowl} alt="Avatar masculino forte com cabelo curto"/><span className="photo-label">O GIGANTE<br/><b>BOWL CUT</b></span></div>
        <div className="hero-photo hero-photo-top"><img src={A.womanShort} alt="Avatar feminino de cabelo curto"/><span>SHORT • FUN</span></div>
        <div className="hero-photo hero-photo-bottom"><img src={A.womanPlus} alt="Avatar feminino plus-size"/><span>PLUS • FASHION</span></div>
        <div className="floating-badge">🔥 <b>100+</b><small>personagens</small></div>
      </div>
    </section>

    <section className="marquee"><span>AVATARES VIRAIS</span><i>✦</i><span>CABELOS CURTOS</span><i>✦</i><span>CORPOS FORTES</span><i>✦</i><span>PLUS-SIZE</span><i>✦</i><span>VÍDEOS COM MOVIMENTO</span></section>

    <section id="avatares" className="section-rich">
      <div className="section-heading"><div><div className="section-kicker">🔥 AVATARES VIRAIS</div><h2>Personagens que <em>chamam atenção.</em></h2></div><Link href="/avatars">Ver biblioteca completa →</Link></div>
      <p className="section-lead">A estética do Avatar Studio não é “mais um avatar perfeito”. É personagem. Cabelo estranho, corpo forte, plus-size, cores inesperadas, moda e personalidade.</p>
      <div className="avatar-grid avatar-grid-large">{avatars.map(([name,tag,image],i)=><article className="avatar-card" key={name}><img src={image} alt={name}/><div className="avatar-shade"/><div className="avatar-info"><span>{tag}</span><h3>{name}</h3><Link href="/cadastro">Usar avatar →</Link></div></article>)}</div>
    </section>

    <section id="videos" className="video-section">
      <div className="section-heading"><div><div className="section-kicker">🎬 VÍDEOS EM MOVIMENTO</div><h2>Não é imagem. É ação.</h2></div><Link href="/videos">Abrir estúdio de vídeo →</Link></div>
      <p className="section-lead">Veja movimento real antes de escolher: dança, caminhada, performance e cenas verticais pensadas para redes sociais.</p>
      <div className="video-showcase">{videos.map(v=><article className="video-card video-motion" key={v.title}><video src={v.src} autoPlay muted loop playsInline preload="metadata"/><div className="video-overlay"><span className="play">▶</span><div><b>{v.title}</b><small>{v.meta} • MOVIMENTO</small></div></div></article>)}</div>
    </section>

    <section id="como" className="steps-section"><div className="section-kicker">COMO FUNCIONA</div><h2>Você cria. A IA faz o resto.</h2><div className="steps"><div><b>01</b><span>📸</span><h3>Escolha seu avatar</h3><p>Use um personagem pronto ou descreva o seu.</p></div><div><b>02</b><span>✍️</span><h3>Escreva a ideia</h3><p>Roteiro, fala, dança, anúncio ou história.</p></div><div><b>03</b><span>🎬</span><h3>Gere o vídeo</h3><p>Escolha movimento, voz, formato e estilo.</p></div></div></section>

    <section className="final-cta"><div><div className="section-kicker">PRONTO PARA CRIAR?</div><h2>Seu próximo personagem começa agora.</h2><p>Crie sua conta gratuitamente e entre no Avatar Studio.</p></div><Link className="hero-primary" href="/cadastro">Começar grátis →</Link></section>
    <footer className="landing-footer"><span>✦ AVATAR STUDIO AI</span><span>Seu avatar. Seus vídeos. Sem limites.</span><span>© 2026</span></footer>
  </main>;
}
