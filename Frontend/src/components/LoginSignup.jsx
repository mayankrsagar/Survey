import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api";

export default function LoginSignup() {
  /* ---------- login ---------- */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  /* ---------- signup ---------- */
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("user");
  const [showSignupPwd, setShowSignupPwd] = useState(false);

  /* ---------- UI toggle ---------- */
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  /* ---------- handlers ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/login", {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Login successful");
      setTimeout(() => {
        data.user.role === "admin"
          ? navigate("/ahome")
          : navigate("/createsurvey");
      }, 1200);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/signup", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
      });
      toast.success("Account created — please log in");
      setTimeout(() => setIsLogin(true), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  };

  /* ---------- eye icon ---------- */
  const EyeOpen = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
  const EyeClosed = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      />
    </svg>
  );

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-800 flex items-start justify-center py-16">
      <div className="w-full max-w-md px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden">
          {/* header */}
          <div className="flex">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-4 text-center font-semibold transition-colors duration-200 ${
                isLogin
                  ? "bg-white/6 text-white"
                  : "bg-transparent text-slate-300 hover:bg-white/3"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-4 text-center font-semibold transition-colors duration-200 ${
                !isLogin
                  ? "bg-white/6 text-white"
                  : "bg-transparent text-slate-300 hover:bg-white/3"
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="p-6">
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-slate-200 text-lg font-medium">
                  Welcome back
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="relative">
                  <input
                    type={showLoginPwd ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showLoginPwd ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                >
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <label className="block text-slate-200 text-lg font-medium">
                  Create your account
                </label>

                <input
                  type="text"
                  placeholder="User name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="relative">
                  <input
                    type={showSignupPwd ? "text" : "password"}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSignupPwd ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>

                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                >
                  Sign up
                </button>
              </form>
            )}

            <div className="mt-4 text-center text-sm text-slate-400">
              {isLogin ? (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
