// import React from "react";
// import { useNavigate } from "react-router-dom";

// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// function TaskCard({ task }) {

//   const navigate = useNavigate();

//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition
//   } = useSortable({ id: task.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     ...taskStyle
//   };

//   return (

//     <div
//       ref={setNodeRef}
//       style={style}
//       onClick={() => navigate(`/tasks/${task.id}`)}
//     >

//       {/* drag handle */}
//       <div
//         {...attributes}
//         {...listeners}
//         style={{ cursor: "grab", marginBottom: "5px" }}
//       >
//         ⋮⋮
//       </div>

//       <strong>{task.title}</strong>

//       <p style={{ fontSize: "13px" }}>
//         {task.description}
//       </p>

//     </div>

//   );

// }

// const taskStyle = {
//   background: "white",
//   padding: "10px",
//   borderRadius: "6px",
//   marginBottom: "10px",
//   boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
// };

// export default TaskCard;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

function TaskCard({ task, onEdit, onDelete }) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  // ===== MENU STATE =====
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    e.stopPropagation(); // ❗ tránh click mở task
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ===== STYLE =====
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      onClick={() => navigate(`/tasks/${task.id}`)}
      sx={{
        background: "white",
        p: 1.5,
        borderRadius: 2,
        mb: 1,
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)"
        }
      }}
    >
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* DRAG HANDLE */}
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          sx={{
            cursor: "grab",
            fontSize: 14,
            color: "#888"
          }}
        >
          ⋮⋮
        </Box>

        {/* MENU */}
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* TITLE */}
      <Typography fontWeight={600} fontSize={14}>
        {task.title}
      </Typography>

      {/* DESCRIPTION */}
      {task.description && (
        <Typography fontSize={12} color="gray" mt={0.5}>
          {task.description}
        </Typography>
      )}

      {/* TAG / PRIORITY */}
      {task.priority && (
        <Chip
          label={task.priority}
          size="small"
          sx={{
            mt: 1,
            bgcolor:
              task.priority === "high"
                ? "#ff4d4f"
                : task.priority === "medium"
                ? "#faad14"
                : "#52c41a",
            color: "white",
            fontSize: 11
          }}
        />
      )}

      {/* DUE DATE */}
      {task.due_date && (
        <Typography fontSize={11} color="red" mt={0.5}>
          Due:{" "}
          {new Date(task.due_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short"
          })}
        </Typography>
      )}

      {/* MENU DROPDOWN */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit(task);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(task.id);
            handleMenuClose();
          }}
          sx={{ color: "red" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default TaskCard;