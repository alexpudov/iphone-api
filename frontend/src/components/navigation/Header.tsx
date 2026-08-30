import { Link } from "react-router-dom";
import { useAuth } from "../../auth/Auth_Context";

export function Header() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/">Doctors</Link>
        {" | "}
        <Link to="/appointments">Appointments</Link>
      </nav>

      <div>
        <span>{user?.email}</span>

        {isAdmin && <span> | Admin</span>}

        {" | "}

        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
