export default function DashboardPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px 6vw" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>AVATAR STUDIO <span style={{ opacity: .5 }}>AI</span></strong>
        <span style={{ color: "#9298aa", fontSize: 14 }}>Dashboard</span>
      </header>
      <section style={{ maxWidth: 1100, margin: "80px auto" }}>
        <p style={{ color: "#9b8cff", marginBottom: 8 }}>Seu estúdio</p>
        <h1 style={{ fontSize: 48, letterSpacing: "-.05em", marginTop: 0 }}>O que você quer criar?</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, marginTop: 40 }}>
          {[
            ["Criar avatar", "Monte seu apresentador digital personalizado."],
            ["Criar vídeo", "Comece com um roteiro e escolha seu avatar."],
            ["Minha biblioteca", "Veja seus avatares e vídeos gerados."],
          ].map(([title, text]) => (
            <div key={title} style={{ border: "1px solid #252936", background: "#11131a", borderRadius: 20, padding: 26 }}>
              <h2>{title}</h2>
              <p style={{ color: "#9298aa", lineHeight: 1.5 }}>{text}</p>
              <button style={{ marginTop: 12, background: "#fff", border: 0, borderRadius: 10, padding: "10px 15px" }}>Abrir →</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
