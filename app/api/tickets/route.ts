import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { computeSlaDueAt, isBreached } from "@/lib/sla";
import type { Category, Priority } from "@prisma/client";

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  // refresh SLA breach flags lightly
  const now = Date.now();
  const toBreach = tickets.filter(t => !t.slaBreached && t.slaDueAt.getTime() < now).map(t => t.id);
  if (toBreach.length) {
    await prisma.ticket.updateMany({
      where: { id: { in: toBreach } },
      data: { slaBreached: true },
    });
  }

  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await readSessionToken(token) : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const priority = body.priority as Priority;
  const category = body.category as Category;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!priority || !category) return NextResponse.json({ error: "Priority and category required" }, { status: 400 });

  const slaDueAt = computeSlaDueAt(priority);

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      priority,
      category,
      slaDueAt,
      slaBreached: isBreached(slaDueAt),
      createdById: session.id,
    },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json(ticket);
}
