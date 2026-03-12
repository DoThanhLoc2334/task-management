import React from "react";
import BaseModal from "../BaseModal";

function UploadAttachmentModal({ onClose }) {

  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log("File:", file);
  };

  return (
    <BaseModal title="Upload Attachment" onClose={onClose}>

      <input type="file" onChange={handleUpload} />

      <button style={{marginTop:"10px"}} onClick={onClose}>
        Close
      </button>

    </BaseModal>
  );
}

export default UploadAttachmentModal;