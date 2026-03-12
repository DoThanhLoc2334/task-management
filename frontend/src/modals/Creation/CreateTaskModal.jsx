import React, { useState } from "react";
import { users } from "../../mock/mockData";

function CreateTaskModal({ columnId, onClose, onAddTask }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      id: "t" + Date.now(),
      title,
      description,
      assignee_id: assignee || null,
      due_date: dueDate,
      column_id: columnId,
      created_by: "u1"
    };

    // Add task vào state
    onAddTask(newTask);

    // Reset form
    setTitle("");
    setDescription("");
    setAssignee("");
    setDueDate("");

    onClose();
  };

  return (

    <div style={overlayStyle}>

      <div style={modalStyle}>

        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>

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
            <label>Assignee</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div style={field}>
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={buttons}>
            <button type="submit">Create</button>
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