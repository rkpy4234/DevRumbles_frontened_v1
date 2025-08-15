"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "../AdminGuard";
import AdminLayout from "../AdminLayout";

interface Announcement {
  id: number;
  topic: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ topic: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
  const router = useRouter();

  // Fetch announcements on load
  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    fetchAnnouncements();
  }, [token]);

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
      setError("Could not load announcements.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input and textarea changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update announcement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      topic: form.topic,
      description: form.description,
    };

    try {
      const url = editId !== null ? `${API_URL}/${editId}` : API_URL;
      const method = editId !== null ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error(editId !== null ? "Update failed" : "Add failed");

      setEditId(null);
      setForm({ topic: "", description: "" });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // Delete announcement
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit announcement
  const handleEditClick = (announcement: Announcement) => {
    setEditId(announcement.id);
    setForm({
      topic: announcement.topic,
      description: announcement.description,
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ topic: "", description: "" });
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="flex justify-center mt-10">
          <div className="w-full max-w-md">
            {" "}
            {/* roughly col-4 width */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <h4 className="text-2xl text-center font-bold">
                    {editId !== null ? "Edit Announcement" : "Add Announcement"}
                  </h4>
                </CardTitle>

                <CardDescription>
                  {error && <p className="text-red-600 mb-4">{error}</p>}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    name="topic"
                    placeholder="Topic"
                    value={form.topic}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                  />

                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                  />

                  <div className="flex gap-4 justify-end">
                    {editId !== null && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`px-6 py-2 rounded text-white ${
                        editId !== null
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {editId !== null ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Form */}

          {/* Table */}
          {loading ? (
            <p>Loading announcements...</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4 border">Topic</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Created By</th>
                  <th className="py-2 px-4 border">Created At</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.length > 0 ? (
                  announcements.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">{a.topic}</td>
                      <td className="py-2 px-4 border">{a.description}</td>
                      <td className="py-2 px-4 border">{a.createdBy || "-"}</td>
                      <td className="py-2 px-4 border">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border flex gap-2">
                        <button
                          onClick={() => handleEditClick(a)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
