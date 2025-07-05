import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/backend/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="name" style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Nom</label>
        <input
          id="name"
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, border: "2px solid #0070f3", padding: 8, borderRadius: 4 }}
        />
        <label htmlFor="email" style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, border: "2px solid #0070f3", padding: 8, borderRadius: 4 }}
        />
        <label htmlFor="password" style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, border: "2px solid #0070f3", padding: 8, borderRadius: 4 }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Register
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
      <div style={{ marginTop: 10 }}>
        Already have an account? <a href="/login">Login here</a>
      </div>
    </div>
  );
}
