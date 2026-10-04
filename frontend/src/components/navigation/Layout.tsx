import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import "./navigation.css";

export function Layout() {
  return (
    <div className="app-layout">
      <Header />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
