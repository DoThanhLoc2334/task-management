import React, { useState } from "react";
import { createTask } from "../../services/task.service";
import { parseToken } from "../../Utils/parseToken";

function CreateTaskModal({ columnId, onClose, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");
  const user = parseToken(token);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        column_id: columnId,
        title,
        description,
        created_by: user?.id,
        start_date: new Date().toISOString().split("T")[0],
        due_date: dueDate || null,
        
      };


      console.log("PAYLOAD:", payload);
      const res = await createTask(payload);

      // 👉 data trả về từ backend
      const newTask = res.data;

      // update UI
      onAddTask(newTask);

      // reset form
      setTitle("");
      setDescription("");
   
      setDueDate("");

      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

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
              {loading ? "Creating..." : "Create"}
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

export default CreateTaskModal;