// @ts-nocheck

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

function getUser(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

export async function PUT(req: Request, context: any) {
  try {
    // MUST AWAIT PARAMS
    const { id } = await context.params;   // ← IMPORTANT FIX

    const admin = getUser(req);

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const leave = await prisma.leave.findUnique({ where: { id } });

    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    const updated = await prisma.leave.update({
      where: { id },
      data: {
        status: action === "APPROVE" ? "APPROVED" : "REJECTED",
      },
    });

    return NextResponse.json(updated);

  } catch (err) {
    console.error("PUT /api/leaves/[id] ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}