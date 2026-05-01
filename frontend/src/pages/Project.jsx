import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const STATUS_STYLES = {
  todo: "bg-stone-100 text-stone-500",
  inprogress: "bg-amber-50 text-amber-700",
  done: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABELS = {
  todo: "Todo",
  inprogress: "In Progress",
  done: "Done",
};

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  // Decode current user id from JWT
  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  })();

  const fetchProject = async () => {
    const res = await API.get(`/projects/${id}`);
    setProject(res.data);
  };

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${id}`);
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title.trim()) return;
    await API.post("/tasks", {
      title,
      project: id,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
    });
    setTitle("");
    setDueDate("");
    setAssignedTo("");
    fetchTasks();
  };

  const updateStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await API.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const addMember = async () => {
    setMemberError("");
    try {
      const res = await API.post(`/projects/${id}/members`, { email: memberEmail });
      setProject(res.data);
      setMemberEmail("");
    } catch (err) {
      setMemberError(err.response?.data?.msg || "Error adding member");
    }
  };

  const removeMember = async (userId) => {
    try {
      const res = await API.delete(`/projects/${id}/members/${userId}`);
      setProject(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error removing member");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, []);

  const isCreator = project?.createdBy?._id === currentUserId;

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const isOverdue = (t) =>
    t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-6 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="text-xs tracking-[0.3em] uppercase text-stone-400 hover:text-stone-600 transition-colors mb-4 inline-block"
          >
            ← Dashboard
          </Link>
          <div className="flex items-end justify-between">
            <h2
              className="text-4xl font-semibold text-stone-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {project?.name || "Tasks"}
            </h2>
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors mb-1"
            >
              {showMembers ? "Hide" : "Team"} ({project?.members?.length || 1})
            </button>
          </div>
        </div>

        {/* Team / Members Panel */}
        {showMembers && project && (
          <div className="mb-8 bg-white border border-stone-200 rounded-sm p-5">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4">Team Members</p>
            <div className="space-y-2 mb-4">
              {project.members.map((m) => (
                <div key={m._id} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-stone-800">{m.name}</span>
                    <span className="ml-2 text-xs text-stone-400">{m.email}</span>
                    {project.createdBy?._id === m._id && (
                      <span className="ml-2 text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-sm">
                        Owner
                      </span>
                    )}
                  </div>
                  {isCreator && project.createdBy?._id !== m._id && (
                    <button
                      onClick={() => removeMember(m._id)}
                      className="text-xs text-stone-300 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isCreator && (
              <div className="flex gap-2 pt-4 border-t border-stone-100">
                <input
                  value={memberEmail}
                  placeholder="Add by email"
                  className="flex-1 bg-[#F7F5F0] border border-stone-200 text-stone-800 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-stone-500 transition-colors placeholder:text-stone-300"
                  onChange={(e) => setMemberEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember()}
                />
                <button
                  onClick={addMember}
                  className="px-4 py-2 bg-stone-900 text-stone-100 text-xs tracking-wide hover:bg-stone-700 transition-colors rounded-sm whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            )}
            {memberError && (
              <p className="text-xs text-red-400 mt-2">{memberError}</p>
            )}
          </div>
        )}

        {/* Add Task */}
        <div className="mb-8 bg-white border border-stone-200 rounded-sm p-4 space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400">New Task</p>
          <input
            value={title}
            placeholder="Task title"
            className="w-full bg-[#F7F5F0] border border-stone-200 text-stone-800 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-stone-500 transition-colors placeholder:text-stone-300"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1">
                Assign to
              </label>
              <select
                value={assignedTo}
                className="w-full bg-[#F7F5F0] border border-stone-200 text-stone-700 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-stone-500"
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Unassigned</option>
                {project?.members?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                className="w-full bg-[#F7F5F0] border border-stone-200 text-stone-700 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-stone-500"
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={createTask}
            className="w-full py-2.5 bg-stone-900 text-stone-100 text-sm tracking-wide hover:bg-stone-700 transition-colors duration-200 rounded-sm"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-16">
            No tasks yet. Add one above.
          </p>
        ) : (
          <div className="space-y-px">
            {tasks.map((t) => (
              <div
                key={t._id}
                className={`bg-white border px-5 py-4 ${
                  isOverdue(t) ? "border-red-200 bg-red-50" : "border-stone-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-sm font-medium mt-0.5 shrink-0 ${STATUS_STYLES[t.status || "todo"]}`}
                    >
                      {STATUS_LABELS[t.status || "todo"]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-stone-800 text-sm leading-snug">{t.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {t.assignedTo && (
                          <span className="text-xs text-stone-400">
                            → {t.assignedTo.name}
                          </span>
                        )}
                        {t.dueDate && (
                          <span
                            className={`text-xs ${
                              isOverdue(t) ? "text-red-500 font-medium" : "text-stone-400"
                            }`}
                          >
                            {isOverdue(t) ? "⚠ " : ""}Due {formatDate(t.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={t.status || "todo"}
                      className="text-xs text-stone-400 bg-transparent border-none focus:outline-none cursor-pointer hover:text-stone-700 transition-colors"
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                    >
                      <option value="todo">Todo</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="text-stone-200 hover:text-red-400 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {tasks.length > 0 && (
          <div className="flex gap-6 mt-8 pt-6 border-t border-stone-200">
            {Object.entries(grouped).map(([status, items]) => (
              <div key={status}>
                <p className="text-xl font-semibold text-stone-800">{items.length}</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 mt-0.5">
                  {STATUS_LABELS[status]}
                </p>
              </div>
            ))}
            {tasks.some(isOverdue) && (
              <div>
                <p className="text-xl font-semibold text-red-500">
                  {tasks.filter(isOverdue).length}
                </p>
                <p className="text-xs uppercase tracking-widest text-red-400 mt-0.5">Overdue</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
