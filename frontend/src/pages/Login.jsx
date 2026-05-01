import { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <Link to="/" className="text-xs tracking-[0.3em] uppercase text-stone-400 hover:text-stone-600 transition-colors mb-10 inline-block">
          ← Back
        </Link>
        <h2
          className="text-3xl font-semibold text-stone-900 mb-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Welcome back
        </h2>
        <p className="text-stone-400 text-sm mb-8">Sign in to your workspace</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
              Email
            </label>
            <input
              placeholder="you@example.com"
              className="w-full bg-white border border-stone-200 text-stone-800 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-stone-500 transition-colors placeholder:text-stone-300"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white border border-stone-200 text-stone-800 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-stone-500 transition-colors placeholder:text-stone-300"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-stone-900 text-stone-100 py-2.5 text-sm tracking-wide hover:bg-stone-700 transition-colors duration-200 rounded-sm"
        >
          Login
        </button>

        <p className="text-stone-400 text-xs mt-6 text-center">
          No account?{" "}
          <Link to="/register" className="text-stone-600 hover:text-stone-900 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
