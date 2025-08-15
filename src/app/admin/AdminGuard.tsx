"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  exp?: number;
  role?: string | string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    try {
      const decoded: MyJwtPayload = jwtDecode(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.replace("/");
        return;
      }

      const roleClaim =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

      if (!userRole || userRole.toLowerCase() !== "admin") {
        router.replace("/");
        return;
      }

      setIsAllowed(true);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      router.replace("/");
      return;
    } finally {
      setChecked(true);
    }
  }, [router]);

  // Block rendering until check is done
  if (!checked) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return isAllowed ? <>{children}</> : null;
}
