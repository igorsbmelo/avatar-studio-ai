const features = [
  { title: "Avatares", text: "Escolha um modelo ou crie seu próprio avatar." },
  { title: "Vídeos", text: "Transforme roteiros em vídeos com apresentadores de IA." },
  { title: "Biblioteca", text: "Organize e reutilize seus avatares e criações." },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px 7vw" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 100 }}>
        <strong style={{ fontSize: 22, letterSpacing: "-0.03em" }}>AVATAR STUDIO <span style={{ opacity: .55 }}>AI</span></strong>
        <button style={{ border: "1px solid #292c36", background: "#11131a", color: "#fff", borderRadius: 12, padding: "11px 18px" }}>
          Entrar
        </button>
      </header>

      <section style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "7px 12px", border: "1px solid #292c36", borderRadius: 999, color: "#aeb3c2", fontSize: 13 }}>
          O seu estúdio de criação com IA
        </div>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 92px)", lineHeight: .95, letterSpacing: "-0.065em", margin: "24px 0" }}>
          Crie. Personalize. <span style={{ color: "#9b8cff" }}>Influencie.</span>
        </h1>
        <p style={{ maxWidth: 650, margin: "0 auto 34px", color: "#aeb3c2", fontSize: 19, lineHeight: 1.6 }}>
          Crie avatares digitais e transforme suas ideias em vídeos prontos para publicar.
        </p>
        <button style={{ border: 0, background: "#fff", color: "#08090d", borderRadius: 14, padding: "15px 24px", fontWeight: 700, cursor: "pointer" }}>
          Começar agora →
        </button>
      </section>

      <section style={{ maxWidth: 1050, margin: "110px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {features.map((feature) => (
          <article key={feature.title} style={{ background: "#11131a", border: "1px solid #20232d", borderRadius: 20, padding: 24 }}>
            <h2 style={{ marginTop: 0, fontSize: 20 }}>{feature.title}</h2>
            <p style={{ color: "#9298aa", lineHeight: 1.55, marginBottom: 0 }}>{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
