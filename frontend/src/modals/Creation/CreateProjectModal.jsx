import React from "react";

function CreateProjectModal({ onClose }) {
  const [projectName, setProjectName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Project created:", {
      name: projectName,
      description: description
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px"
        }}
      >
        <h2>Create Project</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px"
            }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "8px"
            }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">
              Create
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CreateProjectModal;