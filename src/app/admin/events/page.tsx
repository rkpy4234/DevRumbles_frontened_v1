"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../AdminLayout";
import AdminGuard from "../AdminGuard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventType {
  id: number;
  title: string;
  description: string;
  image: string;
  eventDate: string;
  location: string;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    image: null,
    eventDate: "",
    location: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://localhost:7006/api/Events");
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Failed to fetch events");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editId
        ? `https://localhost:7006/api/Events/${editId}`
        : "https://localhost:7006/api/Events";
      const method = editId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("eventDate", form.eventDate);
      formData.append("location", form.location);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Something went wrong");

      toast.success(editId ? "Event updated!" : "Event created!");
      setForm({
        title: "",
        description: "",
        image: null,
        eventDate: "",
        location: "",
      });
      setEditId(null);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ev: EventType) => {
    setForm({
      title: ev.title,
      description: ev.description,
      image: null,
      eventDate: ev.eventDate,
      location: ev.location,
    });
    setEditId(ev.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure to delete this event?")) return;
    try {
      const res = await fetch(`https://localhost:7006/api/Events/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      toast.success("Event deleted!");
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="flex justify-center mt-10">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{editId ? "Edit Event" : "Create Event"}</CardTitle>
              <CardDescription>Fill in the details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setForm({ ...form, image: e.target.files[0] });
                    }
                  }}
                  required={!editId}
                />
                <Input
                  type="datetime-local"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editId
                    ? "Update Event"
                    : "Create Event"}
                </Button>
              </form>

              <div className="mt-6">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="border p-2 mb-2 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold">{ev.title}</h3>
                      {ev.image && (
                        <img
                          src={`https://localhost:7006/${ev.image}`}
                          alt={ev.title}
                          className="w-32 h-20 object-cover my-2"
                        />
                      )}
                      <p>{ev.description}</p>
                      <p>
                        {new Date(ev.eventDate).toLocaleString()} -{" "}
                        {ev.location}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEdit(ev)}>Edit</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(ev.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <Toaster position="top-right" />
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
