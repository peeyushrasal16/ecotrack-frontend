import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { loginContext } from "../../context/LoginContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(loginContext);

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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/how-it-works">
                How It Works
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/raise-request">
                Raise Request
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Welcome, {user?.name}
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