import React from "react";

function LabelBadge({ label }) {

  return (
    <span style={badge}>
      {label.name}
    </span>
  );

}

const badge = {
  background: "#e0e0e0",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "500"
};

export default LabelBadge;