import React from "react";

function AssigneeAvatar({ user }) {

  return (
    <div style={container}>

      <div style={avatar}>
        {user.name.charAt(0)}
      </div>

      <span>{user.name}</span>

    </div>
  );

}

const container = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const avatar = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#1976d2",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold"
};

export default AssigneeAvatar;