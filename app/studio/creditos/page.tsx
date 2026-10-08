"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/browser";

export default function Creditos() {
  const [user,setUser]=useState<any>(null);
  const [credits,setCredits]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState<string>("");
  const [msg,setMsg]=useState("");

  useEffect(()=>{(async()=>{
    const sb=createClient(); const {data:{user}}=await sb.auth.getUser();
    if(!user){window.location.href="/login?next=/studio/creditos";return;}
    setUser(user);
    const {data}=await sb.from("credits").select("balance,video_balance,avatar_balance").eq("user_id",user.id).maybeSingle();
    setCredits(data); setLoading(false);
  })()},[]);

  async function buy(product_type:"video_credit"|"avatar_credit"){
    setBusy(product_type); setMsg("");
    try{
      const sb=createClient();
      const {data:{session}}=await sb.auth.getSession();
      if(!session) throw new Error("Sua sessão expirou. Entre novamente.");
      const {data,error}=await sb.functions.invoke("mercadopago-checkout",{body:{product_type}});
      if(error) throw error;
      if(!data?.checkout_url) throw new Error(data?.error||"Não foi possível abrir o pagamento.");
      window.location.href=data.checkout_url;
    }catch(e){setMsg(e instanceof Error?e.message:"Não foi possível iniciar a compra.");setBusy("");}
  }

  return <main className="library-shell">
    <nav className="profile-nav"><Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link><div><Link href="/avatars">Avatares</Link><Link href="/videos">Vídeos</Link><Link href="/studio">Meu perfil</Link></div></nav>
    <section className="library-head"><div className="section-kicker">💎 CRÉDITOS EXTRAS</div><h1>Continue criando.</h1><p>Seu plano define o limite. Quando quiser passar dele, compre unidades extras por R$ 5 cada.</p></section>
    <section className="credit-shop">
      <article className="credit-product"><div className="credit-icon">📸</div><div><div className="section-kicker">AVATAR EXTRA</div><h2>+1 avatar</h2><p>Use mais um personagem além do limite do seu plano.</p></div><b>R$ 5</b><button className="hero-primary" disabled={busy==="avatar_credit"} onClick={()=>buy("avatar_credit")}>{busy==="avatar_credit"?"Abrindo…":"Comprar avatar →"}</button></article>
      <article className="credit-product"><div className="credit-icon">🎬</div><div><div className="section-kicker">VÍDEO EXTRA</div><h2>+1 vídeo</h2><p>Gere mais um vídeo quando sua franquia mensal ou gratuita acabar.</p></div><b>R$ 5</b><button className="hero-primary" disabled={busy==="video_credit"} onClick={()=>buy("video_credit")}>{busy==="video_credit"?"Abrindo…":"Comprar vídeo →"}</button></article>
    </section>
    <section className="credit-balance"><div><span>📸</span><b>{loading?"—":credits?.avatar_balance??0}</b><small>avatares extras disponíveis</small></div><div><span>🎬</span><b>{loading?"—":credits?.video_balance??0}</b><small>vídeos extras disponíveis</small></div><div><span>💎</span><b>{loading?"—":credits?.balance??0}</b><small>créditos gerais</small></div></section>
    {msg&&<p className="form-msg form-error credit-message">{msg}</p>}
  </main>
}
