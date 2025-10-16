import React, { useEffect, useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api";

export default function UserEdit() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------- fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setUser({
          name: data.name || "",
          email: data.email || "",
          password: "",
        });
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/useredit/${id}`, user);
      toast.success("User updated");
      navigate("/users");
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      <style>{`
        .bg-futuristic {
          background:
            radial-gradient(ellipse at top, #1e1b4b 0%, #0f0c29 70%),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><filter id="a"><feTurbulence baseFrequency=".8" numOctaves="3" result="noise"/><feColorMatrix in="noise" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .25 0"/></filter></defs><rect width="100%" height="100%" filter="url(%23a)" opacity=".3"/></svg>');
          background-size: cover;
          animation: pan 20s linear infinite;
        }
        @keyframes pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }
        .neon-ring:focus-within {
          box-shadow: 0 0 0 2px #6366f1;
        }
      `}</style>

      <div className="min-h-screen bg-futuristic text-slate-100 flex items-center justify-center px-4">
        {/* card */}
        <div className="w-full max-w-2xl glass rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wider">Edit User</h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1.5 text-xs rounded-md border border-slate-400 hover:bg-slate-700 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => navigate("/users")}
                className="px-3 py-1.5 text-xs rounded-md bg-indigo-500 hover:bg-indigo-400 transition"
              >
                Users
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading…</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600
                             focus:outline-none neon-ring text-slate-100 placeholder-slate-400"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600
                             focus:outline-none neon-ring text-slate-100 placeholder-slate-400"
                  placeholder="john@example.com"
                />
              </div>

              {/* Password with eye */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, [e.target.name]: e.target.value })
                    }
                    className="w-full pr-10 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600
                               focus:outline-none neon-ring text-slate-100 placeholder-slate-400"
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-md border border-slate-400 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-5 py-2 rounded-md font-medium transition
                             ${
                               saving
                                 ? "bg-indigo-400 cursor-not-allowed"
                                 : "bg-indigo-500 hover:bg-indigo-400"
                             }`}
                >
                  {saving ? "Saving…" : "Update User"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
