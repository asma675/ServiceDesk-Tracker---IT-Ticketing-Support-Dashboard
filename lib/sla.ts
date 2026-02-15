import type { Priority } from "@prisma/client";

export function slaHours(priority: Priority) {
  if (priority === "HIGH") return 4;
  if (priority === "MEDIUM") return 24;
  return 72;
}

export function computeSlaDueAt(priority: Priority) {
  const h = slaHours(priority);
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

export function isBreached(slaDueAt: Date) {
  return Date.now() > slaDueAt.getTime();
}
