import React from "react";

function CreateColumnModal({ onClose, onCreate }) {
  const [columnName, setColumnName] = React.useState("");

  const handleCreate = () => {
    if (columnName.trim()) {
      onCreate(columnName);
      setColumnName("");
      onClose();
    }
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
          width: "300px"
        }}
      >
        <h2>Create New Column</h2>

        <input
          type="text"
          placeholder="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button onClick={handleCreate}>Create</button>

        <button
          onClick={onClose}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateColumnModal;