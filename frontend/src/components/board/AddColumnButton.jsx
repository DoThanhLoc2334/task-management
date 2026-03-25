import React from "react";

function AddColumnButton({ onClick }) {
  return (
    <button style={buttonStyle} onClick={onClick}>
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

export default AddColumnButton;