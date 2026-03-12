import React from "react";
import BaseModal from "../BaseModal";
import { users } from "../../mock/mockData";

function ChangeAssigneeModal({ onClose }) {

  const handleSelect = (user) => {
    console.log("Assignee:", user);
    onClose();
  };

  return (
    <BaseModal title="Change Assignee" onClose={onClose}>

      {users.map((user)=>(
        <div key={user.id} style={{marginBottom:"8px"}}>

          <button onClick={()=>handleSelect(user)}>
            {user.name}
          </button>

        </div>
      ))}

    </BaseModal>
  );
}

export default ChangeAssigneeModal;