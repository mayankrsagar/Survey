import React, { useState } from "react";

import {
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api";
import Navbar from "./Navbar";

export default function CreateSurvey() {
  /* ---------- state ---------- */
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: [""] }]);
  const [surveyId, setSurveyId] = useState("");
  const [openIdx, setOpenIdx] = useState(0); // accordion
  const [saving, setSaving] = useState(false); // loading

  const navigate = useNavigate();

  /* ---------- helpers ---------- */
  const updateQ = (i, val) => {
    const q = [...questions];
    q[i].question = val;
    setQuestions(q);
  };
  const updateOpt = (qi, oi, val) => {
    const q = [...questions];
    q[qi].options[oi] = val;
    setQuestions(q);
  };
  const addQ = () =>
    setQuestions([...questions, { question: "", options: [""] }]);
  const remQ = (i) => setQuestions(questions.filter((_, idx) => idx !== i));
  const addOpt = (qi) => {
    const q = [...questions];
    q[qi].options.push("");
    setQuestions(q);
  };
  const remOpt = (qi, oi) => {
    const q = [...questions];
    q[qi].options.splice(oi, 1);
    setQuestions(q);
  };

  /* ---------- dirty-check for confirmation on close ---------- */
  const isDirty = () => {
    if (surveyId) return true; // created — consider it not safe to just close
    if (title.trim()) return true;
    for (const q of questions) {
      if (q.question.trim()) return true;
      for (const o of q.options) {
        if (o.trim()) return true;
      }
    }
    return false;
  };

  // const handleClose = () => {
  //   // if saving, prevent close
  //   if (saving) return;

  //   if (isDirty()) {
  //     const ok = window.confirm(
  //       "You have unsaved changes. Discard and close the form?"
  //     );
  //     if (!ok) return;
  //   }
  //   // prefer going back in history, fallback to /mysurveyforms
  //   try {
  //     navigate(-1);
  //   } catch {
  //     navigate("/mysurveyforms");
  //   }
  // };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id || !user?.name) return toast.error("You must be logged in");
    setSaving(true);

    try {
      const cleaned = {
        title: title.trim(),
        questions: questions
          .filter((q) => q.question.trim()) // remove empty questions
          .map((q) => ({
            question: q.question.trim(),
            options: q.options.map((o) => o.trim()).filter(Boolean), // remove empty options
          })),
        userId: user.id,
        userName: user.name,
      };

      if (!cleaned.questions.length)
        throw new Error("At least one question is required");

      const { data } = await API.post("/api/surveys/create", cleaned);
      setSurveyId(data.surveyId);
      toast.success("Survey created!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Creation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------- copy link ---------- */
  const shareLink = `${window.location.origin}/respond/${surveyId}`;
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.info("Link copied to clipboard");
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
        .neon-ring:focus-within {
          box-shadow: 0 0 0 2px #6366f1;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .accordion-content.open {
          max-height: 500px;
        }
      `}</style>
      <Navbar />
      <div className="min-h-screen bg-futuristic text-slate-100 flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl glass-card rounded-2xl p-6 sm:p-8 space-y-6"
          noValidate
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Create Custom Survey
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Build, share, analyse – in seconds
              </p>
            </div>

            {/* <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 text-sm text-slate-100 border border-white/10"
                title="Close form"
              >
                <FaTimes />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div> */}
          </div>

          {/* Title */}
          <div className="neon-ring rounded-lg">
            <label className="block text-sm font-medium mb-1">
              Survey Title
            </label>
            <input
              type="text"
              name="title"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Satisfaction 2025"
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600
                         text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Questions Accordion */}
          <div className="space-y-3">
            {questions.map((q, qi) => (
              <div
                key={qi}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-3 bg-white/5 cursor-pointer"
                  onClick={() => setOpenIdx(openIdx === qi ? null : qi)}
                >
                  <span className="text-sm font-medium">Question {qi + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remQ(qi);
                      }}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <FaTrash />
                    </button>
                    {openIdx === qi ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`accordion-content ${
                    openIdx === qi ? "open" : ""
                  }`}
                >
                  <div className="p-4 space-y-4 bg-white/5">
                    <div>
                      <label className="text-xs text-slate-300">
                        Question text
                      </label>
                      <input
                        type="text"
                        name={`question-${qi}`}
                        autoComplete="off"
                        value={q.question}
                        onChange={(e) => updateQ(qi, e.target.value)}
                        placeholder="What do you think about …?"
                        required
                        className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-slate-600
                                   text-slate-100 placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300">Options</label>
                      {q.options.map((o, oi) => (
                        <div key={oi} className="flex gap-2">
                          <input
                            type="text"
                            name={`option-${qi}-${oi}`}
                            autoComplete="off"
                            value={o}
                            onChange={(e) => updateOpt(qi, oi, e.target.value)}
                            placeholder={`Option ${oi + 1}`}
                            className="flex-1 px-3 py-2 rounded-md bg-slate-900/50 border border-slate-600
                                       text-slate-100 placeholder-slate-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => remOpt(qi, oi)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOpt(qi)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <FaPlus /> Add option
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question */}
          <button
            type="button"
            onClick={addQ}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-slate-500
                       text-slate-300 hover:text-white hover:border-white transition"
          >
            <FaPlus /> Add Question
          </button>

          {/* Submit – the only trigger */}
          <button
            type="submit"
            disabled={saving || !title || questions.some((q) => !q.question)}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
                       text-white font-semibold hover:from-indigo-400 hover:to-purple-500
                       disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? "Creating…" : "Create Survey"}
          </button>

          {/* Share Link */}
          {surveyId && (
            <div className="p-4 rounded-lg bg-white/10 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Share this link
                  </div>
                  <div className="text-sm break-all text-indigo-300">
                    {window.location.origin}/respond/{surveyId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyLink}
                  className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-2"
                >
                  <FaCopy /> Copy
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
