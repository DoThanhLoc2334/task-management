import React from "react";

function AttachmentList({ files }) {

  if (!files.length) {
    return <p>No attachments</p>;
  }

  return (

    <div>

      {files.map((file) => (

        <div key={file.id} style={fileBox}>

          📎 {file.name}

        </div>

      ))}

    </div>

  );

}

const fileBox = {
  border: "1px solid #ddd",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "6px"
};

export default AttachmentList;