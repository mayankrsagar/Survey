import React, { useEffect, useState } from "react";

import { FaCopy, FaPaperPlane, FaRedo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api";

export default function RespondSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [respondent, setRespondent] = useState("");
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------- fetch survey ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/api/surveys/${id}`);
        setSurvey(data);
        console.log(data);
        setResponses(new Array(data.questions.length).fill(""));
      } catch {
        toast.error("Could not load survey");
      }
    })();
  }, [id]);

  /* ---------- handle change ---------- */
  const handleChange = (idx, val) => {
    const r = [...responses];
    r[idx] = val;
    setResponses(r);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respondent.trim()) return toast.warning("Please enter your name");
    if (responses.some((r) => !r.trim()))
      return toast.warning("Please answer every question");

    setSaving(true);
    try {
      await API.post(`/api/surveys/respond/${id}`, {
        respondent: respondent.trim(),
        answers: responses.map((r) => r.trim()),
      });
      setSubmitted(true);
      toast.success("Response submitted – thank you!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- copy link ---------- */
  const shareLink = `${window.location.origin}/respond/${id}`;
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.info("Link copied");
  };

  /* ---------- UI ---------- */
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
        .neon-ring:focus-within {
          box-shadow: 0 0 0 2px #6366f1;
        }
      `}</style>

      <div className="min-h-screen bg-futuristic text-slate-100 flex items-center justify-center px-4 py-10">
        {submitted ? (
          <div className="w-full max-w-md glass-card rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Thank you!</h2>
            <p className="text-sm text-slate-300">
              Your response has been recorded.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setRespondent("");
                  setResponses(new Array(survey.questions.length).fill(""));
                }}
                className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-2"
              >
                <FaRedo /> Submit another
              </button>
              <button
                onClick={copyLink}
                className="px-4 py-2 rounded-md border border-slate-400 hover:bg-slate-700 transition flex items-center gap-2"
              >
                <FaCopy /> Copy link
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl glass-card rounded-2xl p-6 sm:p-8 space-y-6"
            noValidate
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {survey.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {survey.questions.length} question(s)
              </p>
            </div>

            {/* Respondent */}
            <div className="neon-ring rounded-lg">
              <label className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="respondent"
                autoComplete="name"
                value={respondent}
                onChange={(e) => setRespondent(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600
                           text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {survey.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    {idx + 1}. {q.question}
                  </label>

                  {/* OPTIONS EXIST → dropdown */}
                  {q.options?.length > 0 ? (
                    <select
                      value={responses[idx] || ""}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-slate-600
                   text-slate-100 focus:outline-none"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {q.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    /* NO OPTIONS → free text */
                    <input
                      type="text"
                      name={`answer-${idx}`}
                      autoComplete="off"
                      value={responses[idx] || ""}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      placeholder="Your answer"
                      required
                      className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-slate-600
                   text-slate-100 placeholder-slate-400 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
                         text-white font-semibold hover:from-indigo-400 hover:to-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {saving ? (
                "Submitting…"
              ) : (
                <>
                  <FaPaperPlane /> Submit Response
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
