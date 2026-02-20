// @ts-nocheck

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export async function PUT(req: Request, context: any) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const { name, email, password, role, totalLeaves } = await req.json();

  let updateData: any = {
    name,
    email,
    role,
    totalLeaves,
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, context: any) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ message: "User deleted" });
}