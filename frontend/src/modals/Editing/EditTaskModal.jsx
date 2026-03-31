import React, { useState, useEffect } from "react";
import { updateTask } from "../../services/task.service";

function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [startDate, setStartDate] = useState(
    task?.start_date ? task.start_date.slice(0, 16) : ""
  );
  const [dueDate, setDueDate] = useState(
    task?.due_date ? task.due_date.slice(0, 16) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartDate(task.start_date ? task.start_date.slice(0, 16) : "");
      setDueDate(task.due_date ? task.due_date.slice(0, 16) : "");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined
      };

      await updateTask(task.id, payload);

      onSave(); // refresh task list
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Edit Task</h2>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={field}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={field}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={field}>
            <label>Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={field}>
            <label>Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={buttons}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ================= STYLES =================
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px"
};

const field = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column"
};

const buttons = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px"
};

export default EditTaskModal;