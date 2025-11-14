"use client";
import { useEffect, useState } from "react";

export default function Admin() {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/leaves", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setLeaves(data));
    }, []);

    async function updateLeave(id, action) {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/leaves/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action }),
        });

        if (res.ok) {
            alert("Updated");
            window.location.reload();
        }
    }

    return (
        <div>
            <h2>Admin — Review Leaves</h2>

            <table border={1} cellPadding={5}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {leaves.map((l) => (
                        <tr key={l.id}>
                            <td>{l.user?.name || l.userId}</td>
                            <td>{l.type}</td>
                            <td>
                                {new Date(l.startDate).toLocaleDateString()} →{" "}
                                {new Date(l.endDate).toLocaleDateString()}
                            </td>
                            <td>{l.days}</td>
                            <td>{l.status}</td>

                            <td>
                                {l.status === "PENDING" && (
                                    <>
                                        <button onClick={() => updateLeave(l.id, "APPROVE")}>
                                            Approve
                                        </button>
                                        <button onClick={() => updateLeave(l.id, "REJECT")}>
                                            Reject
                                        </button>
                                        <button onClick={() => window.location.href = '/reports'}>
                                            Reports
                                        </button>
                                       
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}