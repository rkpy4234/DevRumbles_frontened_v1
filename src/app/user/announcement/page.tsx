"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import UserLayout from "../UserLayou";

interface Announcement {
  id: number;
  topic: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7006/api/UserAnnouncement")
      .then((res) => res.json())
      .then((data) => {
        // Sort descending by CreatedAt
        const sorted = data.sort(
          (a: Announcement, b: Announcement) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAnnouncements(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-medium">
        Loading announcements...
      </p>
    );

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
          Announcements
        </h1>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              className="hover:shadow-2xl transition-shadow duration-300 border border-gray-200 rounded-xl bg-white"
            >
              <CardHeader className="pb-0">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {ann.topic}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  By <span className="font-medium">{ann.createdBy}</span> &bull;{" "}
                  {formatDate(ann.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-4">{ann.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
