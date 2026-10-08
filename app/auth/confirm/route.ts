import { type EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hkbsfabrxgdwbjdveesz.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_phopOGsWG3qRAEchg2FeGw_FhDLp31m";

export async function GET(request:NextRequest){
 const url=request.nextUrl.clone();
 const tokenHash=url.searchParams.get("token_hash");
 const type=url.searchParams.get("type") as EmailOtpType|null;
 const next=url.searchParams.get("next")||"/studio";
 const safeNext=next.startsWith("/")&&!next.startsWith("//")?next:"/studio";
 const cookieStore=await cookies();
 const supabase=createServerClient(SUPABASE_URL,SUPABASE_KEY,{cookies:{getAll(){return cookieStore.getAll();},setAll(cookiesToSet){cookiesToSet.forEach(({name,value,options})=>cookieStore.set(name,value,options));}}});
 if(tokenHash && type){
  const {error}=await supabase.auth.verifyOtp({token_hash:tokenHash,type});
  if(!error)return NextResponse.redirect(new URL(safeNext,url.origin));
 }
 return NextResponse.redirect(new URL("/login?error=confirmation_failed",url.origin));
}
