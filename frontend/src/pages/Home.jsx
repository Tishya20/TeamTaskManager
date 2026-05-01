import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4 font-medium">
          Workspace
        </p>
        <h1
          className="text-5xl font-semibold text-stone-900 leading-tight mb-4"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Team Task
          <br />
          Manager
        </h1>
        <p className="text-stone-500 text-base mb-10 leading-relaxed">
          Manage your projects and tasks with clarity.
        </p>
        <div className="flex gap-3">
          <Link to="/Login">
            <button className="px-6 py-2.5 bg-stone-900 text-stone-100 text-sm tracking-wide hover:bg-stone-700 transition-colors duration-200 rounded-sm">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2.5 border border-stone-300 text-stone-700 text-sm tracking-wide hover:border-stone-500 hover:text-stone-900 transition-colors duration-200 rounded-sm bg-transparent">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
