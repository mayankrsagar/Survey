import React, { useEffect, useState } from "react";

import { FaPoll, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import API from "../api";
import Anavbar from "./Anavbar";

export default function Ahome() {
  const [users, setUsers] = useState([]);
  const [surveyForms, setSurveyForms] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- fetch ---------- */
  useEffect(() => {
    (async () => {
      try {
        const [uRes, sRes] = await Promise.all([
          API.get("/users"),
          API.get("/surveyforms"),
        ]);
        setUsers(uRes.data);
        setSurveyForms(sRes.data);
      } catch {
        /* ignore – empty state will show */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- counters ---------- */
  const totalUsers = users.length;
  const totalSurveys = surveyForms.length;

  /* ---------- chart data ---------- */
  const chartData = [
    { name: "Users", value: totalUsers, fill: "#6366f1" },
    { name: "Surveys", value: totalSurveys, fill: "#22d3ee" },
  ];

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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Stats Cards */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Quick Stats</h2>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-8 bg-white/10 rounded mb-4"></div>
                    <div className="h-10 bg-white/10 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Users Card */}
                <Link to="/users" className="group">
                  <div className="glass-card rounded-2xl p-6 neon-btn">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-300">
                        Total Users
                      </span>
                      <div className="text-2xl text-indigo-400">
                        <FaUsers />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                      {totalUsers}
                    </div>
                  </div>
                </Link>

                {/* Surveys Card */}
                <Link to="/surveyforms" className="group">
                  <div className="glass-card rounded-2xl p-6 neon-btn">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-300">
                        Total Surveys
                      </span>
                      <div className="text-2xl text-cyan-400">
                        <FaPoll />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                      {totalSurveys}
                    </div>
                  </div>
                </Link>

                {/* Empty third card (placeholder) */}
                <div className="glass-card rounded-2xl p-6 opacity-50">
                  <div className="text-sm text-slate-400">
                    More metrics coming soon…
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Chart */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Visual Overview</h2>
            <div className="w-full h-80 glass-card rounded-2xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 12, 41, 0.9)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8" }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
