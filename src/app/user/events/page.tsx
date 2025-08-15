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

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  eventDate: string;
  location: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7006/api/UserEvent") // your API endpoint
      .then((res) => res.json())
      .then((data) => {
        // Sort descending by EventDate
        const sorted = data.sort(
          (a: Event, b: Event) =>
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
        setEvents(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Format date using vanilla JS
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <p className="text-center mt-20">Loading events...</p>;

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <Card
              key={ev.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl">{ev.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {formatDate(ev.eventDate)} &bull; {ev.location}
                </CardDescription>
              </CardHeader>
              <div className="p-3 ">
                {ev.image && (
                  <img
                    src={`https://localhost:7006/${ev.image}`}
                    alt={ev.title}
                    className="w-full object-cover rounded-md my-2"
                  />
                )}
              </div>
              <CardContent>
                <p className="text-gray-700">{ev.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
