import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import type { TicketStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await readSessionToken(token) : null;
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status } = await req.json().catch(() => ({}));
  if (!status) return NextResponse.json({ error: "Status is required" }, { status: 400 });

  const nextStatus = status as TicketStatus;

  const updated = await prisma.ticket.update({
    where: { id: params.id },
    data: { status: nextStatus },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json(updated);
}
