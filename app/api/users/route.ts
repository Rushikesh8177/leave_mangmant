// @ts-nocheck

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { number } from "zod";

function getAdmin(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user.role === "ADMIN" ? user : null;
  } catch {
    return null;
  }
}

// GET — All users (Admin only)
export async function GET(req: Request) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST — Create a new user
export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, password, role, totalLeaves } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
      totalLeaves: Number(totalLeaves) || 18,
      leavesTaken: 0,
    },
  });

  return NextResponse.json(user);
}