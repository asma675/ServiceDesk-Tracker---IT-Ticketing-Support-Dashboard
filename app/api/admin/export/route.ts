import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

function esc(v: any) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return '"' + s.replaceAll('"', '""') + '"';
  return s;
}

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await readSessionToken(token) : null;
  if (!session || session.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  const header = [
    "id","title","description","status","priority","category",
    "requester_name","requester_email","createdAt","updatedAt","slaDueAt","slaBreached"
  ];

  const rows = tickets.map(t => [
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.category,
    t.createdBy.name,
    t.createdBy.email,
    t.createdAt.toISOString(),
    t.updatedAt.toISOString(),
    t.slaDueAt.toISOString(),
    t.slaBreached
  ].map(esc).join(","));

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"servicedesk_tickets.csv\""
    }
  });
}
