import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";
import "../LoginPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setError("");

      await register({
        email,
        password,
      });

      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <div className="login-field">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="login-field">
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
