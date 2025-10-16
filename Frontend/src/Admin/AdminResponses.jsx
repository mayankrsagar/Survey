import React, { useEffect, useState } from "react";

import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api";

export default function AdminResponses() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: s }, { data: r }] = await Promise.all([
          API.get(`/api/surveys/${id}`),
          API.get(`/api/surveys/results/${id}`),
        ]);
        setSurvey(s);
        setResponses(r);
      } catch {
        toast.error("Failed to load survey or responses");
      }
    })();
  }, [id]);

  const deleteResponse = async (responseId) => {
    if (!window.confirm("Delete this response permanently?")) return;
    try {
      await API.delete(`/responses/${responseId}`);
      setResponses((prev) => prev.filter((x) => x._id !== responseId));
      toast.success("Response deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!survey)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-slate-300">
        Loading…
      </div>
    );

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
          transition: all .2s ease;
          filter: drop-shadow(0 0 2px #6366f1);
        }
        .neon-btn:hover {
          filter: drop-shadow(0 0 6px #6366f1);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="min-h-screen bg-futuristic text-slate-100">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold tracking-widest">
                SURVEY RESPONSES
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => window.history.back()}
                  className="px-3 py-1.5 text-xs rounded-md border border-slate-400 hover:bg-slate-700 transition"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Responses */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {survey.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {responses.length} response(s)
            </p>
          </div>

          {responses.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {responses.map((res, idx) => (
                <div
                  key={res._id}
                  className="glass-card rounded-2xl p-5 relative group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-slate-400"># {idx + 1}</div>
                      <div className="font-semibold text-slate-200">
                        {res.respondent}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteResponse(res._id)}
                      className="text-rose-400 hover:text-rose-300 neon-btn"
                      title="Delete response"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {res.answers.map((a, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-indigo-400 pl-3"
                      >
                        <div className="text-xs text-slate-400">Q{i + 1}</div>
                        <div className="text-sm text-slate-200">
                          {a.question}
                        </div>
                        <div className="text-sm font-medium text-indigo-300">
                          → {a.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              No responses yet
            </div>
          )}
        </main>
      </div>
    </>
  );
}
