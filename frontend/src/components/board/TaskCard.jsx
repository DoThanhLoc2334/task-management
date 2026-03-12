import React from "react";
import { useNavigate } from "react-router-dom";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task }) {

  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...taskStyle
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >

      {/* drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", marginBottom: "5px" }}
      >
        ⋮⋮
      </div>

      <strong>{task.title}</strong>

      <p style={{ fontSize: "13px" }}>
        {task.description}
      </p>

    </div>

  );

}

const taskStyle = {
  background: "white",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "10px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
};

export default TaskCard;