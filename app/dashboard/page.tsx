import TopNav from "@/components/TopNav";
import TicketForm from "@/components/TicketForm";
import ChartsPanel from "@/components/ChartsPanel";
import StatCard from "@/components/StatCard";
import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import dynamic from "next/dynamic";

const TicketTableClient = dynamic(() => import("./ticket-table-client"), { ssr: false });

export default async function Dashboard() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await readSessionToken(token) : null;

  if (!session) return null;

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  const open = tickets.filter(t => t.status === "OPEN").length;
  const inProg = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  const breached = tickets.filter(t => t.slaBreached || t.slaDueAt.getTime() < Date.now()).length;

  return (
    <div className="min-h-screen">
      <TopNav userName={session.name} role={session.role} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Track IT support tickets with filters, charts, SLA timing, and (admin) status updates + CSV export.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open" value={open} icon={<ListTodo className="h-6 w-6" />} />
          <StatCard label="In Progress" value={inProg} icon={<Clock3 className="h-6 w-6" />} />
          <StatCard label="Resolved" value={resolved} icon={<CheckCircle2 className="h-6 w-6" />} />
          <StatCard label="SLA Breached" value={breached} icon={<AlertTriangle className="h-6 w-6" />} />
        </div>

        <ChartsPanel tickets={tickets as any} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <TicketForm onCreated={() => { /* table refresh button exists */ }} />
          </div>
          <div className="lg:col-span-2">
            <TicketTableClient isAdmin={session.role === "ADMIN"} />
          </div>
        </div>
      </main>
    </div>
  );
}
