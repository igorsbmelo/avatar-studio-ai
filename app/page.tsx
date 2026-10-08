import Link from "next/link";

const features = [
  ["🔥 Avatares Virais","Personagens engraçados, estilosos, futuristas e totalmente personalizados."],
  ["🎬 Vídeos","Crie vídeos verticais para Reels, Stories, TikTok e Shorts."],
  ["💳 Planos","Teste Free, Basic, Gold e Pro antes do lançamento."],
  ["🛡️ Segurança","Moderação, consentimento e controles de segurança no backend."],
];

export default function Home(){
  return <main className="site-shell">
    <nav className="nav"><div className="brand">AVATAR STUDIO <span>AI</span></div><Link className="ghost" href="/login">Entrar</Link></nav>
    <section className="hero">
      <div className="eyebrow">SEU AVATAR. SEUS VÍDEOS. SEM LIMITES.</div>
      <h1>Crie seu avatar.<br/><span>Crie seus vídeos.</span></h1>
      <p>Transforme suas ideias em vídeos com avatares gerados por inteligência artificial.</p>
      <div className="actions"><Link className="primary" href="/cadastro">Começar grátis →</Link><Link className="ghost" href="/login">Já tenho uma conta</Link></div>
    </section>
    <section className="grid">{features.map(([title,text])=><article className="card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</section>
    <footer>Avatar Studio AI · ambiente de testes pré-lançamento</footer>
  </main>;
}