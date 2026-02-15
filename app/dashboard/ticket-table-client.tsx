"use client";

import { useEffect, useState } from "react";
import TicketTable from "@/components/TicketTable";

type Ticket = any;

export default function TicketTableClient({ isAdmin }: { isAdmin: boolean }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="card p-5 text-slate-600 text-sm">
        Loading tickets...
      </div>
    );
  }

  return <TicketTable tickets={tickets} isAdmin={isAdmin} onRefresh={load} />;
}
