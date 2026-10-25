import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { loginContext } from "../../context/LoginContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(loginContext);
  const location = useLocation();

  const isRoleUser = user?.role?.roleName === "ROLE_USER";
  const isRoleAdmin = user?.role?.roleName === "ROLE_ADMIN";
  const dashboardLink = isRoleAdmin ? "/admin/dashboard" : "/user/dashboard";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🌱 EcoTrack
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#ecoNavbar"
          aria-controls="ecoNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="ecoNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/workshops" ? "active" : ""}`} to="/workshops">
                Workshops
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/how-it-works" ? "active" : ""}`} to="/how-it-works">
                How It Works
              </Link>
            </li>

            {/* Dashboard Nav Link */}
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname.includes("dashboard") ? "active fw-semibold" : ""}`}
                  to={dashboardLink}
                >
                  Dashboard
                </Link>
              </li>
            )}

            {isRoleUser && (
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/raise-request" ? "active" : ""}`} to="/raise-request">
                  Raise Request
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`} to="/contact">
                Contact
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item ms-lg-2">
                  <span className="nav-link text-white-50">
                    Welcome, <strong className="text-white">{user?.firstName || user?.name || "User"}</strong>
                  </span>
                </li>

                <li className="nav-item ms-lg-3">
                  <button
                    className="btn btn-light text-success fw-semibold"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-3">
                  <Link
                    className="btn btn-light text-success fw-semibold"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item ms-2">
                  <Link
                    className="btn btn-outline-light fw-semibold"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
