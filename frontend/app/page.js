"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:4000/check-auth", {
          credentials: "include",
        });
        if (res.ok) {
          router.replace("/upload"); // already logged in → redirect
        } else {
          router.replace("/login"); // not logged in → go to login
        }
      } catch (err) {
        router.replace("/login");
      }
    }
    checkAuth();
  }, [router]);

  return <p>Checking login status...</p>;
}