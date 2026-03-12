import React, { useState } from "react";
import BaseModal from "../BaseModal";

function AddCommentModal({ onClose }) {

  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    console.log("Comment:", comment);
    onClose();
  };

  return (
    <BaseModal title="Add Comment" onClose={onClose}>

      <textarea
        rows="4"
        style={{ width: "100%" }}
        placeholder="Write your comment..."
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
      />

      <button onClick={handleSubmit} style={{marginTop:"10px"}}>
        Add Comment
      </button>

    </BaseModal>
  );
}

export default AddCommentModal;