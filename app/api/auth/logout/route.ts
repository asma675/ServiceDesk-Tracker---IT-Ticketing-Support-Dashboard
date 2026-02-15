import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.redirect(new URL("/login", "http://localhost"));
  // NextResponse.redirect requires absolute; but in Next it will rewrite.
  res.cookies.set(sessionCookieOptions().name, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
