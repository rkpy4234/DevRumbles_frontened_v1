

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  exp?: number;
  role?: string | string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}

interface WithAuthOptions {
  role?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions
) {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const decoded: MyJwtPayload = jwtDecode(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        const roleClaim =
          decoded.role ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

        if (
          options?.role &&
          userRole &&
          userRole.toLowerCase() !== options.role.toLowerCase()
        ) {
          router.push("/");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        router.push("/");
      }
    }, [router]);

    return <Component {...(props as P)} />; 
  };

  return AuthenticatedComponent;
}
