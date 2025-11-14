"use client";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    totalLeaves: 18,
  });

  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  async function loadUsers() {
    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function createUser(e: any) {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("User created!");
      loadUsers();
    } else {
      alert("Error creating user");
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete user?")) return;

    await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadUsers();
  }

  return (
    <div>
      <h2>Admin - Manage Users</h2>

      <h3>Create New User</h3>
      <form onSubmit={createUser}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" onChange={handleChange} />
        <select name="role" onChange={handleChange}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <input
          name="totalLeaves"
          placeholder="Total Leaves"
          type="number"
          onChange={handleChange}
        />
        <button type="submit">Create</button>
      </form>

      <h3>All Users</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Total Leaves</th>
            <th>Leaves Taken</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.totalLeaves}</td>
              <td>{u.leavesTaken}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}