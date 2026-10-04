import { Link } from "react-router-dom";
import { useAuth } from "../../auth/Auth_Context";
import "./navigation.css";

export function Header() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <Link className="header-logo" to="/">
          Clinic Booking
        </Link>

        <nav className="header-nav">
          <Link className="header-link" to="/">
            Doctors
          </Link>

          <Link className="header-link" to="/appointments">
            Appointments
          </Link>
        </nav>

        <div className="header-user">
          <div className="header-user-info">
            <span className="header-email">{user?.email}</span>

            {isAdmin && <span className="header-role">Admin</span>}
          </div>

          <button className="button button-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
