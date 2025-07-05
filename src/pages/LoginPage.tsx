import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/pages/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch('http://localhost:3001/backend/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      // Use login from AuthContext
      login({ _id: data.userId, email, role: data.role }, data.token);

      // Redirect based on role
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, border: '2px solid #0070f3', padding: 8, borderRadius: 4 }}
        />
        <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, border: '2px solid #0070f3', padding: 8, borderRadius: 4 }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      <div style={{ marginTop: 10 }}>
        Pas encore de compte ? <a href="/register">Créer un compte</a>
      </div>
    </div>
  );
}
