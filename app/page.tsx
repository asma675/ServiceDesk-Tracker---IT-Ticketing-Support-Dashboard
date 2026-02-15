import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-xl w-full p-8">
        <h1 className="text-3xl font-semibold tracking-tight">ServiceDesk Tracker</h1>
        <p className="text-slate-600 mt-3">
          A ticketing-style IT support dashboard with filters, reporting charts, SLA tracking, CSV export, and role-based access.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link className="btn-primary" href="/login">Login</Link>
          <Link className="btn-secondary" href="https://vercel.com" target="_blank">Deploy on Vercel</Link>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          <p className="font-medium text-slate-700">Demo accounts (after seeding):</p>
          <ul className="list-disc ml-5 mt-2">
            <li><span className="font-medium">Admin:</span> admin@demo.com / Admin123!</li>
            <li><span className="font-medium">User:</span> user@demo.com / User123!</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
