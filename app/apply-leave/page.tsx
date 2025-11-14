"use client";
import { useState } from "react";

export default function ApplyLeave() {
  const [type, setType] = useState("SICK");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  async function submit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/leaves", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({
        type,
        startDate: start,
        endDate: end,
        reason,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Leave applied!");
      window.location.href = "/leave-history";
    } else {
      alert(data.error || "Failed");
    }
  }

  return (
    <div>
      <h2>Apply Leave</h2>

      <form onSubmit={submit}>
        <label>Leave Type</label><br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="SICK">Sick</option>
          <option value="CASUAL">Casual</option>
          <option value="PAID">Paid</option>
        </select>
        <br /><br />

        <label>Start Date</label><br />
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <br /><br />

        <label>End Date</label><br />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        <br /><br />

        <label>Reason</label><br />
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
        <br /><br />

        <button type="submit">Apply</button>
      </form>
    </div>
  );
}