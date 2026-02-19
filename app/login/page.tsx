"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Failed to sign in");
    } else {
      setMessage(null);
      router.push("/home");
      return;
    }
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#141414",
        color: "#fff"
      }}
    >
      <div
        style={{
          width: 360,
          padding: 36,
          borderRadius: 8,
          background: "rgba(0,0,0,0.75)"
        }}
      >
        <h1 style={{ marginBottom: 24, fontSize: 28 }}>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 12,
              padding: "12px 14px",
              borderRadius: 4,
              border: "none",
              background: "#333",
              color: "#fff"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 4,
              border: "none",
              background: "#333",
              color: "#fff"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 4,
              border: "none",
              fontWeight: 700,
              background: "#e50914",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {message && (
          <p style={{ marginTop: 16, fontSize: 14 }}>{message}</p>
        )}
        <p style={{ marginTop: 24, fontSize: 14, color: "#b3b3b3" }}>
          New to Netflix?{" "}
          <Link href="/register" style={{ color: "#fff", fontWeight: 600 }}>
            Sign up now
          </Link>
        </p>
      </div>
    </main>
  );
}

