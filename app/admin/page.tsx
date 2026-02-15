import Link from "next/link";
import TopNav from "@/components/TopNav";
import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function AdminPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await readSessionToken(token) : null;
  if (!session) return null;

  return (
    <div className="min-h-screen">
      <TopNav userName={session.name} role={session.role} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="card p-8">
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="text-slate-600 mt-2">
            Admin tools are available directly in the ticket table (status updates + CSV export).
          </p>
          <div className="mt-6">
            <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
