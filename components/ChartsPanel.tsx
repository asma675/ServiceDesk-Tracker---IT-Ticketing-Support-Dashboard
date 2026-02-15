"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { categoryLabel, statusLabel } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type Ticket = {
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  category: "SOFTWARE" | "NETWORK" | "HARDWARE" | "ACCOUNT" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export default function ChartsPanel({ tickets }: { tickets: Ticket[] }) {
  const { byStatus, byCategory, byPriority } = useMemo(() => {
    const s: Record<string, number> = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 };
    const c: Record<string, number> = { SOFTWARE: 0, NETWORK: 0, HARDWARE: 0, ACCOUNT: 0, OTHER: 0 };
    const p: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    for (const t of tickets) {
      s[t.status] = (s[t.status] || 0) + 1;
      c[t.category] = (c[t.category] || 0) + 1;
      p[t.priority] = (p[t.priority] || 0) + 1;
    }
    return { byStatus: s, byCategory: c, byPriority: p };
  }, [tickets]);

  const statusData = {
    labels: ["OPEN", "IN_PROGRESS", "RESOLVED"].map(statusLabel),
    datasets: [
      {
        label: "Tickets",
        data: [byStatus.OPEN, byStatus.IN_PROGRESS, byStatus.RESOLVED],
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(byCategory).map(categoryLabel),
    datasets: [
      {
        label: "Tickets",
        data: Object.values(byCategory),
      },
    ],
  };

  const priorityData = {
    labels: ["LOW", "MEDIUM", "HIGH"],
    datasets: [
      {
        label: "Tickets",
        data: [byPriority.LOW, byPriority.MEDIUM, byPriority.HIGH],
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  } as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="card p-5">
        <h3 className="font-semibold tracking-tight">Open vs Resolved</h3>
        <p className="text-sm text-slate-600 mt-1">Operational status snapshot.</p>
        <div className="mt-4">
          <Bar data={statusData} options={commonOptions} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold tracking-tight">Category volume</h3>
        <p className="text-sm text-slate-600 mt-1">Where tickets concentrate.</p>
        <div className="mt-4">
          <Bar data={categoryData} options={commonOptions} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold tracking-tight">Priority mix</h3>
        <p className="text-sm text-slate-600 mt-1">Workload urgency distribution.</p>
        <div className="mt-4">
          <Doughnut data={priorityData} />
        </div>
      </div>
    </div>
  );
}
