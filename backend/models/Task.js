import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo"
  },
  dueDate: { type: Date, default: null }
});

export default mongoose.model("Task", taskSchema);
