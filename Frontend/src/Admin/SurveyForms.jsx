import React, { useEffect, useState } from "react";

import { FaCopy, FaExternalLinkAlt, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api";
import Anavbar from "./Anavbar";

export default function SurveyForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- fetch all surveys ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/surveyforms");
        setForms(data);
      } catch {
        toast.error("Could not load surveys");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- copy link ---------- */
  const copyLink = (id) => {
    const link = `${window.location.origin}/respond/${id}`;
    navigator.clipboard.writeText(link);
    toast.info("Link copied");
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
          animation: pan 25s linear infinite;
        }
        @keyframes pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }
        .neon-btn {
          transition: all 0.2s ease;
          filter: drop-shadow(0 0 2px #6366f1);
        }
        .neon-btn:hover {
          filter: drop-shadow(0 0 6px #6366f1);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="min-h-screen bg-futuristic text-slate-100">
        {/* Header */}
        <Anavbar />

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-6 bg-white/10 rounded mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-semibold">No surveys yet</h2>
              <p className="text-sm text-slate-400 mt-2">
                When users create surveys, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {forms.map((s) => (
                <div
                  key={s._id}
                  className="glass-card rounded-2xl p-6 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-slate-400">Owner</div>
                      <div className="font-semibold text-slate-200">
                        {s.userName}
                      </div>
                    </div>
                    <div className="text-2xl text-indigo-400">
                      <FaExternalLinkAlt />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">
                    {s.title}
                  </h3>

                  {/* Questions preview */}
                  <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1 mb-4">
                    {s.questions.slice(0, 3).map((q, i) => (
                      <li key={i} className="truncate">
                        {q.question}
                      </li>
                    ))}
                    {s.questions.length > 3 && (
                      <li className="text-xs text-slate-500">
                        … {s.questions.length - 3} more
                      </li>
                    )}
                  </ol>

                  {/* Stats */}
                  <div className="text-xs text-slate-400 mb-4">
                    {s.responses.length} response(s)
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2">
                    <Link
                      to={`/adminresponses/${s._id}`}
                      className="px-3 py-1.5 text-xs rounded-md bg-indigo-500 hover:bg-indigo-400 text-white neon-btn flex items-center gap-1"
                    >
                      <FaEye /> Responses
                    </Link>
                    <button
                      onClick={() => copyLink(s._id)}
                      className="px-3 py-1.5 text-xs rounded-md border border-slate-400 hover:bg-slate-700 transition flex items-center gap-1"
                    >
                      <FaCopy /> Copy
                    </button>
                    <a
                      href={`/respond/${s._id}`}
                      target="_blank"
                      rel="noopener"
                      className="px-3 py-1.5 text-xs rounded-md border border-slate-400 hover:bg-slate-700 transition flex items-center gap-1"
                    >
                      <FaExternalLinkAlt /> Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
