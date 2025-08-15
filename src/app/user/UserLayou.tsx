"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import UserGuard from "./UserGuard";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconHome,
  IconUsers,
  IconMessageCircle,
  IconCalendarEvent,
  IconConfetti,
  IconLogout,
} from "@tabler/icons-react";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { href: "/user/dashboard", icon: IconHome, label: "Home" },
    { href: "/user/events", icon: IconCalendarEvent, label: "Events" },
    { href: "/user/announcement", icon: IconConfetti, label: "Announcements" },
    { href: "/user/messages", icon: IconMessageCircle, label: "Messages" },
  ];

  return (
    <UserGuard>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Header / Navigation */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="text-xl font-extrabold text-blue-500">
                  ConneX
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:flex-1 md:justify-center">
                  <NavigationMenu>
                    <NavigationMenuList className="flex space-x-8">
                      {menuItems.map(({ href, icon: Icon, label }) => (
                        <NavigationMenuItem key={href}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={href}
                                  className={`inline-flex items-center px-3 py-2 ${
                                    pathname === href
                                      ? "text-blue-600"
                                      : "text-gray-700 hover:text-blue-600"
                                  }`}
                                >
                                  <Icon className="h-50 w-50" />
                                  {label}
                                </Link>
                              </NavigationMenuLink>
                            </TooltipTrigger>
                            <TooltipContent>{label}</TooltipContent>
                          </Tooltip>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                {/* Desktop Logout */}
                <div className="hidden md:flex items-center">
                  <Button
                    onClick={handleLogout}
                    variant="default"
                    className="font-semibold"
                  >
                    <IconLogout className="mr-2" /> ESC
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Top Navigation */}
            <div className="md:hidden border-t border-gray-200 bg-white flex justify-around py-2">
              {menuItems.map(({ href, icon: Icon, label }) => (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={`flex flex-col items-center ${
                        pathname === href
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" /> {/* Bigger icons */}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center text-gray-700 hover:text-red-600"
                  >
                    <IconLogout className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* Footer for Desktop */}
          <footer className="hidden md:block bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-gray-500"
                >
                  Contact
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Your Company. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </UserGuard>
  );
}
