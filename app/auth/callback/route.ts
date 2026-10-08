import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SUPABASE_URL=process.env.NEXT_PUBLIC_SUPABASE_URL||"https://hkbsfabrxgdwbjdveesz.supabase.co";
const SUPABASE_KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_phopOGsWG3qRAEchg2FeGw_FhDLp31m";

export async function GET(request:Request){
  const requestUrl=new URL(request.url);
  const code=requestUrl.searchParams.get("code");
  const next=requestUrl.searchParams.get("next")||"/studio";
  const safeNext=next.startsWith("/")&&!next.startsWith("//")?next:"/studio";
  if(!code)return NextResponse.redirect(new URL("/login?error=missing_code",requestUrl.origin));
  const cookieStore=await cookies();
  const supabase=createServerClient(SUPABASE_URL,SUPABASE_KEY,{cookies:{getAll(){return cookieStore.getAll();},setAll(cookiesToSet){cookiesToSet.forEach(({name,value,options})=>cookieStore.set(name,value,options));}}});
  const {error}=await supabase.auth.exchangeCodeForSession(code);
  if(error)return NextResponse.redirect(new URL("/login?error=confirmation_failed",requestUrl.origin));
  return NextResponse.redirect(new URL(safeNext,requestUrl.origin));
}
