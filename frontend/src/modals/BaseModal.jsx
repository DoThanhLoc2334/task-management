import React from "react";

function BaseModal({ title, children, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h3>{title}</h3>
          <button onClick={onClose}>X</button>
        </div>

        <div style={body}>
          {children}
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top:0,
  left:0,
  right:0,
  bottom:0,
  background:"rgba(0,0,0,0.5)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
};

const modal = {
  background:"#fff",
  padding:"20px",
  borderRadius:"8px",
  width:"400px"
};

const header = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:"10px"
};

const body = {
  marginTop:"10px"
};

export default BaseModal;