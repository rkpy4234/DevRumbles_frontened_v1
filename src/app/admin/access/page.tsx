"use client";
import AdminLayout from "../AdminLayout";
import AdminGuard from "../AdminGuard";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

const AVAILABLE_ROLES = ["Admin", "User", "NoRoles"];

export default function page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_BASE = "https://localhost:7006/api/users";

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const deleteUser = (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        fetchUsers();
      })
      .catch(console.error);
  };

  const changeRole = (id: string, newRole: string) => {
    fetch(`${API_BASE}/role/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newRole),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to change role");
        fetchUsers();
      })
      .catch(console.error);
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">All Users</h1>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Full Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Roles</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="border px-4 py-2">{u.fullName}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={u.roles[0] || "NoRoles"}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      {AVAILABLE_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
