import React from "react";
import BaseModal from "../BaseModal";
import { tasks } from "../../mock/mockData";

function AddDependencyModal({ onClose }) {

  const handleSelect = (task) => {
    console.log("Dependency:", task);
    onClose();
  };

  return (
    <BaseModal title="Add Dependency" onClose={onClose}>

      {tasks.map((task)=>(
        <div key={task.id} style={{marginBottom:"8px"}}>

          <button onClick={()=>handleSelect(task)}>
            {task.title}
          </button>

        </div>
      ))}

    </BaseModal>
  );
}

export default AddDependencyModal;