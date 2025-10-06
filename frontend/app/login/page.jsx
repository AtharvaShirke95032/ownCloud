"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", // important: cookies!
    });

    if (res.ok) {
      router.push("/upload");
    } else {
      setError("Wrong password!");
    }
  }

  useEffect(() => {
  async function checkAlreadyLoggedIn() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-auth`, {
      credentials: "include",
    });
    if (res.ok) router.replace("/upload"); // if already logged in, skip login
  }
  checkAlreadyLoggedIn();
}, [router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔐 Enter Password</h1>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}