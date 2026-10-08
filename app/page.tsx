import Link from "next/link";

const avatars = [
  { name: "O Gigante Fashion", tag: "Musculoso • Bowl Cut", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85" },
  { name: "A Diva do Futuro", tag: "Fashion • Rosa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85" },
  { name: "O Influencer", tag: "Street • Azul", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=85" },
  { name: "A Vovó TikTok", tag: "Comedy • Viral", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85" },
];

const videos = [
  { title: "Dica do dia", meta: "30s • 9:16", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=700&q=85" },
  { title: "Story promocional", meta: "15s • 9:16", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85" },
  { title: "Short educativo", meta: "60s • 9:16", image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=700&q=85" },
];

export default function Home() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link>
        <div className="nav-links"><a href="#avatares">Avatares</a><a href="#videos">Vídeos</a><a href="#como">Como funciona</a><Link href="/login">Entrar</Link><Link className="nav-cta" href="/cadastro">Começar grátis</Link></div>
      </nav>

      <section className="hero-rich">
        <div className="hero-copy">
          <div className="eyebrow-pill">✦ IA PARA CRIADORES</div>
          <h1>Seu avatar.<br/><span>Seu conteúdo.</span><br/>Sua próxima viral.</h1>
          <p>Crie personagens únicos, roteiros e vídeos verticais prontos para Reels, TikTok, Shorts e Stories.</p>
          <div className="hero-actions"><Link className="hero-primary" href="/cadastro">Criar meu avatar grátis <span>→</span></Link><Link className="hero-secondary" href="#avatares">Ver avatares <span>▶</span></Link></div>
          <div className="trust-row"><span>⚡ Criação rápida</span><span>🎨 100+ estilos</span><span>📱 9:16</span><span>🛡️ Seguro</span></div>
        </div>
        <div className="hero-collage">
          <div className="glow glow-a"/><div className="glow glow-b"/>
          <div className="hero-photo hero-photo-main"><img src={avatars[0].image} alt="Avatar de destaque"/><span className="photo-label">O GIGANTE<br/><b>FASHION</b></span></div>
          <div className="hero-photo hero-photo-top"><img src={avatars[1].image} alt="Avatar fashion"/><span>AI CREATOR</span></div>
          <div className="hero-photo hero-photo-bottom"><img src={avatars[2].image} alt="Avatar street"/><span>VIRAL MODE</span></div>
          <div className="floating-badge">🔥 <b>100+</b><small>avatares únicos</small></div>
        </div>
      </section>

      <section className="marquee"><span>AVATARES VIRAIS</span><i>✦</i><span>VÍDEOS COM IA</span><i>✦</i><span>REELS • TIKTOK • SHORTS</span><i>✦</i><span>CRIE SEM LIMITES</span></section>

      <section id="avatares" className="section-rich">
        <div className="section-heading"><div><div className="section-kicker">🔥 AVATARES VIRAIS</div><h2>Personagens que <em>chamam atenção.</em></h2></div><Link href="/cadastro">Explorar biblioteca →</Link></div>
        <p className="section-lead">Do elegante ao completamente inesperado. Escolha um pronto ou descreva o personagem que está na sua cabeça.</p>
        <div className="avatar-grid">{avatars.map((a, i)=><article className={`avatar-card avatar-card-${i}`} key={a.name}><img src={a.image} alt={a.name}/><div className="avatar-shade"/><div className="avatar-info"><span>{a.tag}</span><h3>{a.name}</h3><button>Usar avatar →</button></div></article>)}</div>
      </section>

      <section id="videos" className="video-section">
        <div className="section-heading"><div><div className="section-kicker">🎬 VÍDEOS PRONTOS PARA PUBLICAR</div><h2>Ideia → vídeo em poucos cliques.</h2></div><Link href="/cadastro">Criar vídeo →</Link></div>
        <div className="video-showcase">{videos.map(v=><article className="video-card" key={v.title}><img src={v.image} alt={v.title}/><div className="video-overlay"><span className="play">▶</span><div><b>{v.title}</b><small>{v.meta}</small></div></div></article>)}</div>
      </section>

      <section id="como" className="steps-section">
        <div className="section-kicker">COMO FUNCIONA</div><h2>Você cria. A IA faz o resto.</h2>
        <div className="steps"><div><b>01</b><span>📸</span><h3>Escolha seu avatar</h3><p>Use um avatar da biblioteca ou crie o seu com texto.</p></div><div><b>02</b><span>✍️</span><h3>Escreva a ideia</h3><p>Digite um roteiro, tema ou simplesmente diga o que quer.</p></div><div><b>03</b><span>🎬</span><h3>Gere o vídeo</h3><p>Escolha voz, formato e estilo. Depois publique.</p></div></div>
      </section>

      <section className="final-cta"><div><div className="section-kicker">PRONTO PARA CRIAR?</div><h2>Seu próximo vídeo pode começar agora.</h2><p>Crie sua conta gratuitamente e experimente o Avatar Studio AI.</p></div><Link className="hero-primary" href="/cadastro">Começar grátis →</Link></section>
      <footer className="landing-footer"><span>✦ AVATAR STUDIO AI</span><span>Seu avatar. Seus vídeos. Sem limites.</span><span>© 2026</span></footer>
    </main>
  );
}
