"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/leaves", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLeaves(data));
  }, []);

  function exportCSV() {
    const rows = [
      ["User", "Type", "Start", "End", "Days", "Status"],
      ...leaves.map((l) => [
        l.user?.name || l.userId,
        l.type,
        new Date(l.startDate).toLocaleDateString(),
        new Date(l.endDate).toLocaleDateString(),
        l.days,
        l.status,
      ]),
    ];

    let csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "leave_report.csv";
    link.click();
  }

  return (
    <div>
      <h2>Reports</h2>

      <button onClick={exportCSV}>Export CSV</button>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Days</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((l) => (
            <tr key={l.id}>
              <td>{l.user?.name || l.userId}</td>
              <td>{l.type}</td>
              <td>{new Date(l.startDate).toLocaleDateString()}</td>
              <td>{new Date(l.endDate).toLocaleDateString()}</td>
              <td>{l.days}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}