"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, Shield } from "lucide-react";

type Props = {
  userName: string;
  role: string;
};

export default function TopNav({ userName, role }: Props) {
  const path = usePathname();

  return (
    <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          ServiceDesk Tracker
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={cn("btn-secondary", path.startsWith("/dashboard") && "bg-slate-100")}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>

          {role === "ADMIN" && (
            <Link
              href="/admin"
              className={cn("btn-secondary", path.startsWith("/admin") && "bg-slate-100")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Link>
          )}

          <form action="/api/auth/logout" method="post">
            <button className="btn-secondary" type="submit" title="Log out">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </form>

          <div className="hidden sm:flex items-center gap-2 ml-2">
            <span className="text-sm text-slate-600">Hi, {userName}</span>
            <span className="badge border-slate-200 text-slate-700 bg-white">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
