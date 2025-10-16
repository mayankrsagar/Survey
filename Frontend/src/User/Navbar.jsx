import React, { useState } from "react";

import { FaBars, FaPlus, FaPoll, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /* ---------- parse user ---------- */
  let name = "";
  try {
    const { user } = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.name) name = user.name;
  } catch {
    /* ignore corrupt localStorage */
  }

  /* ---------- logout ---------- */
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ---------- UI ---------- */
  return (
    <>
      <style>{`
        .glass-nav {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        .neon-link {
          position: relative;
          transition: color 0.2s ease;
        }
        .neon-link::after {
          content: "";
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: -4px;
          left: 0;
          background: #6366f1;
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .neon-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: #fff;
        }
      `}</style>

      <nav className="glass-nav sticky top-0 z-50 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold tracking-wider">
              Survey-Forms
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/createsurvey"
                className="flex items-center gap-2 neon-link"
              >
                <FaPlus /> Create
              </Link>
              <Link
                to="/mysurveyforms"
                className="flex items-center gap-2 neon-link"
              >
                <FaPoll /> My Surveys
              </Link>

              {/* User + Logout */}
              <div className="flex items-center gap-3">
                <div className="avatar" title={name}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 neon-link"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button onClick={() => setOpen(!open)} className="text-2xl">
                {open ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className="md:hidden flex flex-col gap-4 py-4">
              <Link
                to="/createsurvey"
                className="neon-link"
                onClick={() => setOpen(false)}
              >
                Create Survey
              </Link>
              <Link
                to="/mysurveyforms"
                className="neon-link"
                onClick={() => setOpen(false)}
              >
                My Surveys
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 neon-link"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
