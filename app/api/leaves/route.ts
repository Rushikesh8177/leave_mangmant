// @ts-nocheck

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
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

// helper function to check if user is admin
//gg



export async function GET(req: Request) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role === "ADMIN") {
    const leaves = await prisma.leave.findMany({ include: { user: true } });
    return NextResponse.json(leaves);
  }

  const leaves = await prisma.leave.findMany({
    where: { userId: user.userId },
  });

  return NextResponse.json(leaves);
}

export async function POST(req: Request) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, startDate, endDate, reason } = await req.json();

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const leave = await prisma.leave.create({
    data: {
      type,
      startDate: start,
      endDate: end,
      days: diff,
      reason,
      userId: user.userId,
    },
  });

  return NextResponse.json(leave);
}