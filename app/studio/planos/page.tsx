"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/browser";

const order=["free","basic","gold","pro"];
export default function StudioPlanos(){
 const [user,setUser]=useState<any>(null),[plans,setPlans]=useState<any[]>([]),[current,setCurrent]=useState<any>(null),[busy,setBusy]=useState(""),[msg,setMsg]=useState("");
 useEffect(()=>{(async()=>{const sb=createClient();const {data:{user}}=await sb.auth.getUser();if(!user){window.location.href="/login?next=/studio/planos";return;}setUser(user);const [p,s]=await Promise.all([sb.from("plans").select("*").eq("active",true).order("price_monthly_cents"),sb.from("subscriptions").select("id,status,billing_interval,plan_id,plans(name,slug,price_monthly_cents,price_yearly_cents)").eq("user_id",user.id).maybeSingle()]);setPlans(p.data||[]);setCurrent(s.data);})()},[]);
 async function choose(plan:any){
  setBusy(plan.slug);setMsg("");
  try{
   const sb=createClient();
   if(plan.slug==="free"){
    const {error}=await sb.rpc("switch_to_free_plan"); if(error)throw error;
    window.location.href="/studio?plan=free"; return;
   }
   const {data:{session}}=await sb.auth.getSession(); if(!session)throw new Error("Sua sessão expirou. Entre novamente.");
   const interval=current?.billing_interval==="year"?"year":"month";
   const {data,error}=await sb.functions.invoke("mercadopago-checkout",{body:{plan_slug:plan.slug,billing_interval:interval}});
   if(error)throw error; if(!data?.checkout_url)throw new Error(data?.error||"Não foi possível abrir o pagamento.");
   window.location.href=data.checkout_url;
  }catch(e){setMsg(e instanceof Error?e.message:"Não foi possível mudar de plano.");setBusy("");}
 }
 const currentSlug=current?.plans?.slug||"free";
 return <main className="library-shell">
  <nav className="profile-nav"><Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link><div><Link href="/avatars">Avatares</Link><Link href="/videos">Vídeos</Link><Link href="/studio">Meu perfil</Link></div></nav>
  <section className="library-head"><div className="section-kicker">💎 SEU PLANO</div><h1>Escolha seu ritmo.</h1><p>Você continua logado. Trocar de plano não cria outra conta e não manda você para o cadastro.</p></section>
  <section className="plans-grid">{plans.sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug)).map(plan=><article className={plan.slug===currentSlug?"plan-card plan-card-active":"plan-card"} key={plan.id}><div className="section-kicker">{plan.name}{plan.slug===currentSlug?" • ATUAL":""}</div><h2>{plan.price_monthly_cents===0?"R$ 0":"R$ "+plan.price_monthly_cents/100+"/mês"}</h2><p>{plan.features?.[0]||"Para criadores"}</p><ul><li>{plan.avatar_limit===null?"Avatares ilimitados":plan.avatar_limit+" avatares no plano"}</li><li>{plan.video_limit===null?"Vídeos ilimitados":plan.video_limit+" vídeos/mês"}</li></ul><button className="hero-primary" disabled={busy===plan.slug||plan.slug===currentSlug} onClick={()=>choose(plan)}>{plan.slug===currentSlug?"Plano atual":busy===plan.slug?"Abrindo pagamento…":"Escolher "+plan.name+" →"}</button></article>)}</section>
  {msg&&<p className="form-msg form-error credit-message">{msg}</p>}
 </main>
}
