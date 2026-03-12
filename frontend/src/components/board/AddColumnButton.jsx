import React, { useState } from "react";

function AddColumnButton({ onCreate }) {

  const [showInput, setShowInput] = useState(false);
  const [columnName, setColumnName] = useState("");

  const handleCreate = () => {

    if (!columnName.trim()) return;

    onCreate(columnName);

    setColumnName("");
    setShowInput(false);

  };

  if (showInput) {
    return (

      <div style={inputContainer}>

        <input
          placeholder="Column name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          style={input}
        />

        <div style={{ marginTop: "8px" }}>

          <button onClick={handleCreate}>
            Add
          </button>

          <button onClick={() => setShowInput(false)}>
            Cancel
          </button>

        </div>

      </div>

    );
  }

  return (

    <button
      style={buttonStyle}
      onClick={() => setShowInput(true)}
    >
      + Add Column
    </button>

  );

}

const buttonStyle = {
  minWidth: "200px",
  height: "40px",
  borderRadius: "8px",
  border: "1px dashed #aaa",
  background: "white",
  cursor: "pointer"
};

const inputContainer = {
  minWidth: "220px",
  background: "#f4f5f7",
  padding: "10px",
  borderRadius: "8px"
};

const input = {
  width: "100%",
  padding: "6px"
};

export default AddColumnButton;