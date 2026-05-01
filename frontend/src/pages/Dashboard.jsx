import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/tasks/dashboard/stats");
      setStats(res.data);
    } catch {
      // stats not critical
    } finally {
      setLoadingStats(false);
    }
  };

  const createProject = async () => {
    if (!name.trim()) return;
    await API.post("/projects", { name });
    setName("");
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const daysOverdue = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">Workspace</p>
            <h2
              className="text-4xl font-semibold text-stone-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Dashboard
            </h2>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors mt-2"
          >
            Logout
          </button>
        </div>

        {/* Stats Panel */}
        {!loadingStats && stats && (
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">
              Task Overview
            </p>
            <div className="grid grid-cols-4 gap-px bg-stone-200 border border-stone-200 rounded-sm overflow-hidden">
              {[
                { label: "Total", value: stats.total, color: "text-stone-800" },
                { label: "Todo", value: stats.todo, color: "text-stone-500" },
                { label: "In Progress", value: stats.inprogress, color: "text-amber-600" },
                { label: "Done", value: stats.done, color: "text-emerald-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white px-5 py-5 text-center">
                  <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
                  <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Overdue */}
            {stats.overdue > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  <p className="text-xs tracking-[0.2em] uppercase text-red-400">
                    {stats.overdue} Overdue
                  </p>
                </div>
                <div className="space-y-px">
                  {stats.overdueTasks.map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between bg-red-50 border border-red-100 px-4 py-3"
                    >
                      <div>
                        <span className="text-sm text-stone-800">{t.title}</span>
                        <span className="ml-2 text-xs text-stone-400">
                          in {t.project?.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-red-500 font-medium">
                          {daysOverdue(t.dueDate)}d overdue
                        </p>
                        <p className="text-xs text-stone-400">{formatDate(t.dueDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Project */}
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">Projects</p>
          <div className="flex gap-2">
            <input
              value={name}
              placeholder="New project name"
              className="flex-1 bg-white border border-stone-200 text-stone-800 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-stone-500 transition-colors placeholder:text-stone-300"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createProject()}
            />
            <button
              onClick={createProject}
              className="px-5 py-2.5 bg-stone-900 text-stone-100 text-sm tracking-wide hover:bg-stone-700 transition-colors duration-200 rounded-sm whitespace-nowrap"
            >
              Create
            </button>
          </div>
        </div>

        {/* Project List */}
        {projects.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-16">
            No projects yet. Create one above.
          </p>
        ) : (
          <div className="space-y-px">
            {projects.map((p, i) => (
              <Link
                key={p._id}
                to={`/project/${p._id}`}
                className="flex items-center justify-between bg-white border border-stone-200 px-5 py-4 hover:border-stone-400 hover:bg-stone-50 transition-all duration-150 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-stone-300 w-5 text-right tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="text-stone-800 text-sm font-medium">{p.name}</span>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {p.members?.length || 1} member{p.members?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className="text-stone-300 group-hover:text-stone-500 text-xs transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
