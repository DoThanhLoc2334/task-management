import React from "react";

function AddColumnButton({ onClick }) {

  return (
    <button
      type="button"
      style={style}
      onClick={onClick}
    >
      + Add Column
    </button>
  );
}

const style = {
  minWidth: "200px",
  height: "40px",
  borderRadius: "8px",
  border: "1px dashed #aaa",
  background: "white",
  cursor: "pointer"
};

export default AddColumnButton;