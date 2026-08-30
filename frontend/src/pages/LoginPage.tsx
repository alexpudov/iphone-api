import { useState } from "react";
import { useAuth } from "../auth/Auth_Context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginUser } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setError("");

      await loginUser(email, password);

      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

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
          Login
        </button>
      </form>
      <Link to="/register">Create account</Link>
    </div>
  );
}
