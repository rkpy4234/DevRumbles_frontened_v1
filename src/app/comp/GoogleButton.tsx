"use client";

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton() {
  const handleLogin = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    const res = await fetch("https://localhost:7006/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token); // store JWT
      window.location.href = "/user/dashboard"; // redirect after login
    } else {
      console.error("Google login failed");
    }
  };

  return <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Login Failed")} />;
}
