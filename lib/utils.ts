import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export function priorityLabel(p: string) {
  if (p === "HIGH") return "High";
  if (p === "MEDIUM") return "Medium";
  return "Low";
}

export function statusLabel(s: string) {
  if (s === "IN_PROGRESS") return "In Progress";
  if (s === "RESOLVED") return "Resolved";
  return "Open";
}

export function categoryLabel(c: string) {
  const map: Record<string, string> = {
    SOFTWARE: "Software",
    NETWORK: "Network",
    HARDWARE: "Hardware",
    ACCOUNT: "Account",
    OTHER: "Other",
  };
  return map[c] ?? c;
}

export function slaText(dueIso: string, breached: boolean) {
  const due = new Date(dueIso).getTime();
  const now = Date.now();
  const diff = due - now;
  const abs = Math.abs(diff);
  const hrs = Math.floor(abs / (1000 * 60 * 60));
  const mins = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  const pretty = `${hrs}h ${mins}m`;
  if (breached) return `Breached (${pretty} ago)`;
  if (diff < 0) return `Breached (${pretty} ago)`;
  return `Due in ${pretty}`;
}
