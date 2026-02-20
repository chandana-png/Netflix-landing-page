import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

interface User {
  id: number;
  email: string;
  password_hash: string;
}

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
      "SELECT id, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = Array.isArray(rows) ? (rows as User[])[0] : null;
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // For now we just return success; you can add JWT/cookies later.
    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}

