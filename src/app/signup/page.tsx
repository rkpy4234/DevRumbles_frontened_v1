"use client";
import React, { useState } from "react";
import Link from "next/link";

const countryCodes = [{ code: "+977", name: "Nepal" }];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [selectedCode, setSelectedCode] = useState(countryCodes[0].code);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setMessage(""); // clear previous messages

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }

  const payload = {
    fullName,
    phoneNumber: `${selectedCode}${phone}`,
    email,
    password
  };

try {
  const res = await fetch("https://localhost:7006/api/Auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = {}; // fallback if JSON parsing fails
  }

  if (res.ok) {
    setMessage(data.message || "Registration successful!");
    // Clear form
    setFullName("");
    setSelectedCode(countryCodes[0].code);
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  } else {
    setMessage(data.message || "Registration failed.");
  }
} catch (error) {
  console.error(error);
  setMessage("An error occurred while registering.");
}

};



  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-md p-6 sm:p-10 space-y-6 sm:space-y-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-700">
          Create Account
        </h1>

        {message && (
          <p className="text-center text-sm sm:text-base text-red-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" aria-label="signup form">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-semibold text-blue-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-blue-700">
              Phone Number
            </label>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Select country code"
              >
                {countryCodes.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="984 058 0000"
                className="flex-grow px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-blue-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-blue-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*********"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-semibold text-blue-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="*********"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 sm:mt-6 text-center text-blue-700 font-semibold text-xs sm:text-sm">
          Already have an account?{" "}
          <Link href="/" className="hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
