"use client";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  function go(path: string) {
    window.location.href = path;
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => go("/apply-leave")}>Apply Leave</button>
      <button onClick={() => go("/leave-history")}>My Leaves</button>
      <button onClick={() => go("/admin")}>Admin Panel</button>
      <button onClick={() => go("/reports")}>Reports</button>
      <button onClick={() => window.location.href = "/admin/users"}>
        Manage Users
      </button>

    </div>
  );
}