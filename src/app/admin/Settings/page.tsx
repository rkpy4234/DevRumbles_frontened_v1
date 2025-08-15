import React from "react";
import AdminLayout from "../AdminLayout";
import AdminGuard from "../AdminGuard";

export default function page() {
  return (
    <AdminGuard >

    
    <AdminLayout>
      <div>
        <h1>This is seeting page</h1>
      </div>
    </AdminLayout>
    </AdminGuard>
  );
}
