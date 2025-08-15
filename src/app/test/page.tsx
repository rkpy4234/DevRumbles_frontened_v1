"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Test {
  id?: number;
  fullName: string;
  email: string;
  books: string;
  number: number;
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [form, setForm] = useState<Test>({
    fullName: "",
    email: "",
    books: "",
    number: 0,
  });
  const [editId, setEditId] = useState<number | null>(null); // track editing item
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiBase = "https://localhost:7006/api/basic";

  // Fetch all tests
  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(apiBase);
        if (!res.ok) throw new Error("Failed to fetch tests");
        const data: Test[] = await res.json();
        setTests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Handle form changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "number" ? parseInt(value) || 0 : value
    }));
  };

  // Submit (Create or Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editId) {
        // Update existing test
        const res = await fetch(`${apiBase}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editId }),
        });
        if (!res.ok) throw new Error("Failed to update test");

        setTests(prev => prev.map(t => t.id === editId ? { ...form, id: editId } : t));
        setSuccess("Test updated successfully!");
        setEditId(null);
      } else {
        // Create new test
        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create test");

        const newTest: Test = await res.json();
        setTests(prev => [...prev, newTest]);
        setSuccess("Test created successfully!");
      }

      setForm({ fullName: "", email: "", books: "", number: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete test
  const handleDelete = async (id?: number) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete test");

      setTests(prev => prev.filter(t => t.id !== id));
      setSuccess("Test deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete test");
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const handleEdit = (test: Test) => {
    setForm(test);
    setEditId(test.id || null);
    setSuccess(null);
    setError(null);
  };

  // Cancel editing
  const handleCancel = () => {
    setForm({ fullName: "", email: "", books: "", number: 0 });
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Tests CRUD Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your test records with ease
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">{success}</div>}

        {/* Create/Edit Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editId ? "Edit Test" : "Add New Test"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="books" className="block text-sm font-medium text-gray-700 mb-1">
                  Books
                </label>
                <input
                  id="books"
                  name="books"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={form.books}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  Number
                </label>
                <input
                  id="number"
                  name="number"
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={form.number}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
              >
                {isLoading ? "Processing..." : editId ? "Update Test" : "Add Test"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tests List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Test Records</h2>
          </div>
          {isLoading && tests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Loading tests...</div>
          ) : tests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No tests found</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tests.map((test) => (
                <li key={test.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{test.fullName}</h3>
                    <p className="text-sm text-gray-600">
                      <span>Email:</span> {test.email} | <span>Books:</span> {test.books} |{" "}
                      <span>Number:</span> {test.number}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
