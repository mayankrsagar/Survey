import React, { useEffect, useState } from "react";

import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import API from "../api";
import Anavbar from "./Anavbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/users");
        setUsers(data);
      } catch {
        toast.error("Failed to fetch users");
      }
    })();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/userdelete/${id}`);
      toast.success("User deleted");
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const fetchUserForms = async (userId) => {
    try {
      const { data } = await API.get(`/mysurveyforms/${userId}`);
      setItems(data);
      setShowModal(true);
    } catch {
      toast.error("Could not load forms");
    }
  };

  return (
    <>
      <style>{`
        .bg-futuristic {
          background:
            radial-gradient(ellipse at top, #1e1b4b 0%, #0f0c29 70%),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><filter id="a"><feTurbulence baseFrequency=".8" numOctaves="3" result="noise"/><feColorMatrix in="noise" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .25 0"/></filter></defs><rect width="100%" height="100%" filter="url(%23a)" opacity=".3"/></svg>');
          background-size: cover;
          animation: pan 25s linear infinite;
        }
        @keyframes pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .glass-table {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .neon-btn {
          transition: all .2s ease;
          filter: drop-shadow(0 0 2px #6366f1);
        }
        .neon-btn:hover {
          filter: drop-shadow(0 0 6px #6366f1);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="min-h-screen bg-futuristic text-slate-100">
        <Anavbar />
        {/* Header */}
        {/* <header className="bg-white/5 backdrop-blur border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold tracking-widest">USERS</h1>
              <div className="flex gap-2">
                <Link
                  to="/ahome"
                  className="px-3 py-1.5 text-xs rounded-md border border-slate-400 hover:bg-slate-700 transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header> */}

        {/* Table */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="glass-table rounded-2xl shadow-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  {["#", "ID", "Name", "Email", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u, i) => (
                  <tr key={u._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-300">
                      {u._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-3">
                      <Link
                        to={`/useredit/${u._id}`}
                        className="text-indigo-400 hover:text-indigo-300 neon-btn"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-rose-400 hover:text-rose-300 neon-btn"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => fetchUserForms(u._id)}
                        className="text-cyan-400 hover:text-cyan-300 neon-btn"
                        title="Survey Forms"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                No users yet
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative glass-table rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-wide">Survey Forms</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-300 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {items.length ? (
                items.map((f, i) => (
                  <div
                    key={f._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="font-semibold text-indigo-300">
                        {i + 1}. {f.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        Responses: {f.responses.length}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400">No forms found</p>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
