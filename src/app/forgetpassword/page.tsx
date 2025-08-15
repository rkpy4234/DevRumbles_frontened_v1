"use client";
import React, { useState } from "react";

const countryCodes = [

  { code: "+977", name: "Nepal" }
  // add more if needed
];

export default function ForgetPasswordPage() {
  const [selectedCode, setSelectedCode] = useState("+1");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 to-white px-4">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-700">Reset Password</h1>
        <p className="text-center text-blue-700">
          Enter your phone number to receive a password reset code.
        </p>

        <form className="space-y-6" aria-label="forget password form">
          <div>
            <label className="block mb-1 text-sm font-semibold text-blue-700">
              Phone Number
            </label>
            <div className="flex space-x-2">
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="px-3 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                placeholder="123 456 7890"
                className="flex-grow px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold transition"
          >
            Send Reset Code
          </button>
        </form>

        <p className="mt-6 text-center text-blue-700 font-semibold text-sm">
          Remembered your password?{" "}
          <a href="/" className="hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
