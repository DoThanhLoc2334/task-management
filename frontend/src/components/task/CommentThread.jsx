import React from "react";

function CommentThread({ comments }) {

  if (!comments.length) {
    return <p>No comments yet</p>;
  }

  return (

    <div>

      {comments.map((comment) => (

        <div key={comment.id} style={commentBox}>

          <strong>{comment.user}</strong>

          <p>{comment.text}</p>

        </div>

      ))}

    </div>

  );

}

const commentBox = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "10px"
};

export default CommentThread;