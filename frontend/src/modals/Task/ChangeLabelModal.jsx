import React from "react";
import BaseModal from "../BaseModal";

const labels = ["Bug","Feature","Urgent","Frontend"];

function ChangeLabelModal({ onClose }) {

  const handleSelect = (label) => {
    console.log("Selected label:", label);
    onClose();
  };

  return (
    <BaseModal title="Change Label" onClose={onClose}>

      {labels.map((label)=>(
        <div key={label} style={{marginBottom:"8px"}}>

          <button onClick={()=>handleSelect(label)}>
            {label}
          </button>

        </div>
      ))}

    </BaseModal>
  );
}

export default ChangeLabelModal;