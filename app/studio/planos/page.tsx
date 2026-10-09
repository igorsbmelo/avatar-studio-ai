"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/browser";

const order=["free","basic","gold","pro"];
const fallbackPlans=[
{id:"free",slug:"free",name:"Free",price_monthly_cents:0,price_yearly_cents:0,avatar_limit:1,video_limit:3,features:["Para começar sem pagar"]},
{id:"basic",slug:"basic",name:"Basic",price_monthly_cents:2000,price_yearly_cents:20000,avatar_limit:3,video_limit:10,features:["Para começar a criar"]},
{id:"gold",slug:"gold",name:"Gold",price_monthly_cents:3000,price_yearly_cents:30000,avatar_limit:10,video_limit:20,features:["Para criadores frequentes"]},
{id:"pro",slug:"pro",name:"Pro",price_monthly_cents:5000,price_yearly_cents:50000,avatar_limit:null,video_limit:null,features:["Para criação sem limites"]},
];
export default function StudioPlanos(){
 const [plans,setPlans]=useState<any[]>([]),[current,setCurrent]=useState<any>(null),[busy,setBusy]=useState(""),[msg,setMsg]=useState(""),[interval,setInterval]=useState<"month"|"year">("month"),[loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const sb=createClient();const {data:{user}}=await sb.auth.getUser();if(!user){window.location.href="/login?next=/studio/planos";return;}const [p,s]=await Promise.all([sb.from("plans").select("*").eq("active",true).order("price_monthly_cents"),sb.from("subscriptions").select("id,status,billing_interval,plan_id,plans(name,slug,price_monthly_cents,price_yearly_cents)").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle()]);setPlans(p.data?.length?p.data:fallbackPlans);setCurrent(s.data);if(s.data?.billing_interval==="year")setInterval("year");setLoading(false);if(p.error)setMsg("Não foi possível carregar os planos do servidor. Exibindo os planos padrão; confirme o cadastro de planos no Supabase antes do pagamento.")})()},[]);
 async function choose(plan:any){
  if(plan.slug===currentSlug){setMsg("Este já é seu plano atual.");return}
  setBusy(plan.slug);setMsg("");
  try{
   const sb=createClient();
   if(plan.slug==="free"){
    const {error}=await sb.rpc("switch_to_free_plan");if(error)throw error;
    window.location.href="/studio?plan=free";return;
   }
   const {data:{session}}=await sb.auth.getSession();if(!session)throw new Error("Sua sessão expirou. Entre novamente.");
   const {data,error}=await sb.functions.invoke("mercadopago-checkout",{body:{plan_slug:plan.slug,billing_interval:interval}});
   if(error)throw error;if(!data?.checkout_url)throw new Error(data?.error||"Não foi possível abrir o pagamento.");
   window.location.href=data.checkout_url;
  }catch(e){setMsg(e instanceof Error?e.message:"Não foi possível mudar de plano.");setBusy("")}
 }
 const currentSlug=current?.plans?.slug||"free";
 return <main className="library-shell">
  <nav className="profile-nav"><Link className="brand-mark" href="/"><span className="brand-icon">✦</span> AVATAR STUDIO <b>AI</b></Link><div><Link href="/avatars">Avatares</Link><Link href="/videos">Vídeos</Link><Link href="/studio">Meu perfil</Link></div></nav>
  <section className="library-head"><div className="section-kicker">💎 SEU PLANO</div><h1>Escolha seu ritmo.</h1><p>Você continua logado. Trocar de plano não cria outra conta e não manda você para o cadastro.</p><div className="filter-pills"><button className={interval==="month"?"active":""} onClick={()=>setInterval("month")}>Mensal</button><button className={interval==="year"?"active":""} onClick={()=>setInterval("year")}>Anual — economize</button></div></section>
  {loading?<p style={{textAlign:"center",color:"#9aa0af"}}>Carregando planos…</p>:<section className="plans-grid">{plans.sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug)).map(plan=>{const price=interval==="year"?(plan.price_yearly_cents??plan.price_monthly_cents*10):plan.price_monthly_cents;return <article className={plan.slug===currentSlug?"plan-card plan-card-active":"plan-card"} key={plan.id}><div className="section-kicker">{plan.name}{plan.slug===currentSlug?" • ATUAL":""}</div><h2>{price===0?"R$ 0":"R$ "+(price/100).toLocaleString("pt-BR",{maximumFractionDigits:2})+(interval==="year"?"/ano":"/mês")}</h2><p>{plan.features?.[0]||"Para criadores"}</p><ul><li>{plan.avatar_limit===null?"Avatares ilimitados":plan.avatar_limit+" avatares no plano"}</li><li>{plan.video_limit===null?"Vídeos ilimitados":plan.video_limit+" vídeos/mês"}</li></ul><button className="hero-primary" disabled={busy===plan.slug||plan.slug===currentSlug} onClick={()=>choose(plan)}>{plan.slug===currentSlug?"Plano atual":busy===plan.slug?"Abrindo pagamento…":"Escolher "+plan.name+" →"}</button></article>})}</section>}
  {msg&&<p className="form-msg form-error credit-message">{msg}</p>}
 </main>
}
