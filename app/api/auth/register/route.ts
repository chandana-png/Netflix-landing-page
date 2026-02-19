import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const existing = Array.isArray(rows) ? (rows as any[])[0] : null;
    if (existing) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hash]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}

