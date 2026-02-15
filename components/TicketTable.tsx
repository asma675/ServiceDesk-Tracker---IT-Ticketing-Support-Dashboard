"use client";

import { useMemo, useState } from "react";
import { categoryLabel, cn, formatDate, priorityLabel, slaText, statusLabel } from "@/lib/utils";
import { Download, RefreshCw, ShieldCheck } from "lucide-react";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: "SOFTWARE" | "NETWORK" | "HARDWARE" | "ACCOUNT" | "OTHER";
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  slaBreached: boolean;
  createdBy: { name: string; email: string };
};

const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"] as const;
const priorities = ["ALL", "LOW", "MEDIUM", "HIGH"] as const;
const categories = ["ALL", "SOFTWARE", "NETWORK", "HARDWARE", "ACCOUNT", "OTHER"] as const;

export default function TicketTable({
  tickets,
  isAdmin,
  onRefresh,
}: {
  tickets: Ticket[];
  isAdmin: boolean;
  onRefresh: () => void;
}) {
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("ALL");
  const [category, setCategory] = useState<(typeof categories)[number]>("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.createdBy.name.toLowerCase().includes(q);
      const matchesStatus = status === "ALL" || t.status === status;
      const matchesPriority = priority === "ALL" || t.priority === priority;
      const matchesCategory = category === "ALL" || t.category === category;
      return matchesQuery && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, status, priority, category, query]);

  async function updateStatus(id: string, next: Ticket["status"]) {
    const res = await fetch(`/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) onRefresh();
  }

  async function exportCsv() {
    const res = await fetch("/api/admin/export", { method: "GET" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servicedesk_tickets_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-tight">Tickets</h2>
          <p className="text-sm text-slate-600 mt-1">
            Filter by status, priority, category — and review SLA timing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={onRefresh} title="Refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>

          {isAdmin && (
            <button className="btn-secondary" onClick={exportCsv} title="Export CSV">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
        <input className="input md:col-span-2" placeholder="Search title, description, requester..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value as any)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Priority</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Requester</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">SLA</th>
              {isAdmin ? <th className="py-2 pr-4">Admin</th> : null}
            </tr>
          </thead>
          <tbody className="align-top">
            {filtered.map((t) => {
              const breached = t.slaBreached || new Date(t.slaDueAt).getTime() < Date.now();
              return (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-slate-500 text-xs mt-1 line-clamp-2">{t.description}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={cn("badge", t.status === "RESOLVED" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : t.status === "IN_PROGRESS" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-700")}>
                      {statusLabel(t.status)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{priorityLabel(t.priority)}</td>
                  <td className="py-3 pr-4">{categoryLabel(t.category)}</td>
                  <td className="py-3 pr-4">
                    <div className="text-slate-800">{t.createdBy.name}</div>
                    <div className="text-slate-500 text-xs">{t.createdBy.email}</div>
                  </td>
                  <td className="py-3 pr-4">{formatDate(t.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <span className={cn("badge", breached ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-700")}>
                      {slaText(t.slaDueAt, breached)}
                    </span>
                  </td>
                  {isAdmin ? (
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="btn-secondary" onClick={() => updateStatus(t.id, "OPEN")}>Open</button>
                        <button className="btn-secondary" onClick={() => updateStatus(t.id, "IN_PROGRESS")}>In Progress</button>
                        <button className="btn-secondary" onClick={() => updateStatus(t.id, "RESOLVED")}>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Resolve
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="py-8 text-center text-slate-500">
                  No tickets match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
