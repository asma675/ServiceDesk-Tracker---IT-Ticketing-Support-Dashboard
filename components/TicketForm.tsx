"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const priorities = ["LOW", "MEDIUM", "HIGH"] as const;
const categories = ["SOFTWARE", "NETWORK", "HARDWARE", "ACCOUNT", "OTHER"] as const;

export default function TicketForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("MEDIUM");
  const [category, setCategory] = useState<(typeof categories)[number]>("SOFTWARE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, category }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Failed to create ticket");
      }
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setCategory("SOFTWARE");
      onCreated();
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="font-semibold tracking-tight">Create ticket</h2>
      <p className="text-sm text-slate-600 mt-1">Log a support request with structured fields.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="md:col-span-2">
          <label className="text-sm text-slate-700">Title</label>
          <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., VPN not connecting" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-700">Description</label>
          <textarea className="input mt-1 min-h-[90px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief details to help troubleshoot..." />
        </div>

        <div>
          <label className="text-sm text-slate-700">Priority</label>
          <select className="select mt-1" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-700">Category</label>
          <select className="select mt-1" value={category} onChange={(e) => setCategory(e.target.value as any)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}

      <div className="mt-4 flex gap-2">
        <button
          className="btn-primary disabled:opacity-50"
          disabled={!title.trim() || loading}
          onClick={submit}
        >
          <Plus className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </div>
  );
}
