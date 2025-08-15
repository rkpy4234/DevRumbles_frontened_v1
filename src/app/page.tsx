"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineUserAdd, AiOutlineUnlock } from "react-icons/ai";
import Link from "next/link";
import { useEffect } from "react";
import GoogleLoginButton from "./comp/GoogleButton";

// Define a typed interface for the JWT payload
interface MyJwtPayload {
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string | string[];
  role?: string | string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | string
    | string[];
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("https://localhost:7006/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      const token = data.token;

      // Store JWT
      localStorage.setItem("token", token);

      // Decode JWT
      const decoded = jwtDecode<MyJwtPayload>(token);

      let userRole: string | undefined;

      // Check for standard `role` claim
      if (decoded.role) {
        userRole = Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;
      }
      // Check ASP.NET Core role claim
      else if (
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      ) {
        const roleClaim =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;
      }

      console.log("Decoded role:", userRole);

      setMessage(" Login successful!");

      // Role-based navigation
      const normalizedRole = userRole?.toString().trim().toLowerCase();
      if (normalizedRole === "admin") {
        router.push("/admin/dashboard");
      } else if (normalizedRole === "user") {
        router.push("/user/dashboard");
      } else {
        setMessage("Wrog Credetntial");
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? ` ${err.message}` : " An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  //URL login prevent

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: MyJwtPayload = jwtDecode(token);
      const role =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const normalizedRole = Array.isArray(role)
        ? role[0].toString().trim().toLowerCase()
        : role?.toString().trim().toLowerCase();

      if (normalizedRole === "admin") {
        router.push("/admin/dashboard");
      } else if (normalizedRole === "user") {
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
    }
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-10 space-y-8 bg-white/70 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Quick Junction
        </h1>

        <form
          className="space-y-6"
          onSubmit={handleLogin}
          aria-label="login form"
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-semibold text-blue-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-semibold text-blue-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="*********"
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex items-center justify-center space-x-2 text-blue-600 font-semibold text-sm">
          <span>Or sign in with</span>
        </div>

        <GoogleLoginButton />

        <div className="flex flex-col sm:flex-row justify-between items-center text-blue-700 font-semibold text-sm mt-6 space-y-3 sm:space-y-0">
          <Link href="/signup" className="flex items-center gap-1">
            <AiOutlineUserAdd size={18} />
            Sign Up
          </Link>
          <Link href="/forgetpassword" className="flex items-center gap-1">
            <AiOutlineUnlock size={18} />
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
