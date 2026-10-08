"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/browser";

const showcase = [
  ["O Gigante Bowl Cut","Forte • Bowl Cut","https://images.unsplash.com/photo-1764698072833-dd137d82bbba?auto=format&fit=crop&w=800&q=85"],
  ["A Rainha Geométrica","Curto • Fashion","https://images.unsplash.com/photo-1682310934014-47fbe9d0f3d7?auto=format&fit=crop&w=800&q=85"],
  ["A Diva Plus","Plus-size • Forte","https://images.unsplash.com/photo-1664893875908-a1e56db71082?auto=format&fit=crop&w=800&q=85"],
];

type Row = Record<string, any>;

export default function Studio(){
 const [user,setUser]=useState<any>(null),[profile,setProfile]=useState<Row|null>(null),[sub,setSub]=useState<Row|null>(null),[credits,setCredits]=useState<Row|null>(null);
 const [avatars,setAvatars]=useState<Row[]>([]),[videos,setVideos]=useState<Row[]>([]),[payments,setPayments]=useState<Row[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/login";return;}setUser(user);
  const [p,s,c,a,v,pa]=await Promise.all([
   supabase.from("users").select("*").eq("id",user.id).maybeSingle(),
   supabase.from("subscriptions").select("status,billing_interval,current_period_end,plans(name,slug,price_monthly_cents,price_yearly_cents)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle(),
   supabase.from("credits").select("balance,video_balance,lifetime_earned,lifetime_spent").eq("user_id",user.id).maybeSingle(),
   supabase.from("avatars").select("id,name,image_path,status,style,gender,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(8),
   supabase.from("videos").select("id,name,status,format,duration_seconds,video_path,thumbnail_path,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(8),
   supabase.from("payments").select("id,amount_cents,currency,status,provider,product_type,paid_at,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(8)
  ]);
  setProfile(p.data);setSub(s.data);setCredits(c.data);setAvatars(a.data||[]);setVideos(v.data||[]);setPayments(pa.data||[]);setLoading(false);
 })()},[]);
 async function logout(){await createClient().auth.signOut();window.location.href="/";}
 const plan=sub?.plans?.name||"Free"; const price=sub?.plans?.price_monthly_cents?"R$ "+(sub.plans.price_monthly_cents/100).toFixed(0)+"/mês":"R$ 0";
 return <main className="profile-shell">
  <nav className="profile-nav"><Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link><div><Link href="/avatars">Avatares</Link><Link href="/videos">Vídeos</Link><Link className="profile-nav-active" href="/studio">Meu perfil</Link><button onClick={logout}>Sair</button></div></nav>
  <section className="profile-layout">
   <aside className="profile-hero"><div className="profile-orb">✦</div><div className="section-kicker">SEU STUDIO</div><h1>{profile?.display_name||user?.email?.split("@")[0]||"Criador"}</h1><p>{user?.email}</p><div className="plan-pill">✦ {plan} <span>{price}</span></div><Link className="hero-primary profile-create" href="/avatars">+ Criar avatar</Link><Link className="hero-secondary profile-create" href="/videos">🎬 Criar vídeo</Link></aside>
   <section className="profile-content">
    <div className="profile-title"><div><div className="section-kicker">PAINEL</div><h2>Seu conteúdo em um só lugar.</h2></div></div>
    <div className="stats-row"><div><span>💎</span><b>{credits?.balance??0}</b><small>créditos</small></div><div><span>🎬</span><b>{credits?.video_balance??0}</b><small>vídeos extras</small></div><div><span>📸</span><b>{avatars.length}</b><small>meus avatares</small></div><div><span>🎞️</span><b>{videos.length}</b><small>meus vídeos</small></div></div>
    <section className="profile-card"><div className="profile-card-head"><div><div className="section-kicker">MEUS AVATARES</div><h3>Seus personagens</h3></div><Link href="/avatars">Ver todos →</Link></div>{loading?<div className="empty-state">Carregando seus avatares…</div>:<div className="mini-avatar-grid">{avatars.length?avatars.map(a=><div className="mini-avatar" key={a.id}><img src={a.image_path||showcase[0][2]} alt={a.name}/><div><b>{a.name}</b><small>{a.style||"Avatar personalizado"}</small></div></div>):showcase.map(([name,tag,image])=><div className="mini-avatar" key={name}><img src={image} alt={name}/><div><b>{name}</b><small>{tag}</small></div></div>)}</div>}</section>
    <section className="profile-card"><div className="profile-card-head"><div><div className="section-kicker">MEUS VÍDEOS</div><h3>Criações recentes</h3></div><Link href="/videos">Ver biblioteca →</Link></div>{videos.length?<div className="recent-list">{videos.map(v=><div className="recent-row" key={v.id}><span className="recent-play">▶</span><div><b>{v.name||"Meu vídeo"}</b><small>{v.duration_seconds||0}s • {v.format||"9:16"} • {v.status}</small></div><span className="status-dot">{v.status}</span></div>)}</div>:<div className="empty-state"><span>🎬</span><b>Seu primeiro vídeo começa aqui.</b><p>Escolha um avatar, uma ação e crie seu primeiro Reel.</p><Link href="/videos" className="small-cta">Criar vídeo →</Link></div>}</section>
    <div className="profile-two"><section className="profile-card"><div className="profile-card-head"><div><div className="section-kicker">PLANO</div><h3>{plan}</h3></div><Link href="/planos">Alterar →</Link></div><div className="plan-details"><b>{price}</b><span>{sub?.current_period_end?"Próxima renovação: "+new Date(sub.current_period_end).toLocaleDateString("pt-BR"):"Plano gratuito ativo"}</span></div></section>
    <section className="profile-card"><div className="profile-card-head"><div><div className="section-kicker">PAGAMENTOS</div><h3>Histórico</h3></div><span className="muted">Mercado Pago</span></div>{payments.length?<div className="payment-list">{payments.slice(0,3).map(p=><div className="payment-row" key={p.id}><span>{p.product_type==="subscription"?"💳":"🎬"}</span><b>R$ {(p.amount_cents/100).toFixed(2)}</b><small>{p.status} • {p.paid_at?new Date(p.paid_at).toLocaleDateString("pt-BR"):"pendente"}</small></div>)}</div>:<div className="empty-small">Nenhum pagamento ainda.</div>}</section></div>
   </section>
  </section>
 </main>
}