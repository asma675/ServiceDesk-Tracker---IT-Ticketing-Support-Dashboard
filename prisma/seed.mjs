import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function hoursFromNow(h) {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

function getSlaHours(priority) {
  if (priority === "HIGH") return 4;
  if (priority === "MEDIUM") return 24;
  return 72;
}

async function main() {
  // wipe
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("Admin123!", 10);
  const userPass = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@demo.com",
      password: adminPass,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "User",
      email: "user@demo.com",
      password: userPass,
      role: "USER",
    },
  });

  const demoTickets = [
    {
      title: "VPN not connecting",
      description: "User cannot connect to VPN from home Wi‑Fi.",
      status: "OPEN",
      priority: "HIGH",
      category: "NETWORK",
      createdById: user.id,
    },
    {
      title: "Password reset request",
      description: "Account locked after too many attempts.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      category: "ACCOUNT",
      createdById: user.id,
    },
    {
      title: "Printer queue stuck",
      description: "Print jobs are queued but never print.",
      status: "RESOLVED",
      priority: "LOW",
      category: "HARDWARE",
      createdById: admin.id,
    },
    {
      title: "Software install: VS Code",
      description: "Need VS Code installed with extensions.",
      status: "OPEN",
      priority: "LOW",
      category: "SOFTWARE",
      createdById: admin.id,
    },
  ];

  for (const t of demoTickets) {
    const slaHours = getSlaHours(t.priority);
    await prisma.ticket.create({
      data: {
        ...t,
        slaDueAt: hoursFromNow(slaHours),
        slaBreached: false,
      },
    });
  }

  console.log("Seeded DB with demo users + tickets.");
  console.log("Admin login: admin@demo.com / Admin123!");
  console.log("User login : user@demo.com / User123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
