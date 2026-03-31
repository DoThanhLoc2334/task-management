import React, { useState } from "react";
import { Box, Typography, Paper, Button, CircularProgress, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTaskModal from "../../modals/Creation/CreateTaskModal";
import EditTaskModal from "../../modals/Editing/EditTaskModal.jsx";
import { deleteTask } from "../../services/task.service.js";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const ColumnContainer = ({ column, workspaceId, tasks = [], loadingTasks = false, onAddTask }) => {
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);

  // ======= EDIT TASK =======
  const handleEditTask = (task) => {
    setEditTaskData(task);
    setOpenEditTask(true);
  };

  const handleSaveEditTask = async () => {
    await onAddTask(); // refresh danh sách task
    setOpenEditTask(false);
    setEditTaskData(null);
  };

  // ======= DELETE TASK =======
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId); // token đã gửi trong headers
      await onAddTask(); // refresh danh sách task
    } catch (err) {
      console.error(err);
      alert("Delete task failed: " + (err.response?.data?.message || err.message));
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };
  return (
    <Paper sx={{ width: 300, p: 2, borderRadius: 3, backgroundColor: "#f4f5f7", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
      {/* COLUMN TITLE */}
      <Typography fontWeight={600} mb={2}>
        {column.column_name || column.name}
      </Typography>

      {/* TASK LIST */}
      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
        {loadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography fontSize={12} color="gray">No tasks</Typography>
        ) : (
          tasks.map((task) => (
              <Paper
                key={task.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  position: "relative", // QUAN TRỌNG
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "#e4e6ea",
                    transform: "translateY(-2px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }
                }}
              >
                {/* NÚT 3 CHẤM */}
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, task)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                {/* CONTENT */}
                <Typography fontSize={14} fontWeight={600}>
                  {task.title}
                </Typography>

                {task.description && (
                  <Typography fontSize={12} color="gray">
                    {task.description}
                  </Typography>
                )}

                {task.due_date && (
                  <Typography fontSize={11} color="red">
                    Due: {new Date(task.due_date).toLocaleDateString("en-GB")}
                  </Typography>
                )}
              </Paper>
            ))
             
              

          
        )}
      </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              if (!selectedTask) return;
              handleEditTask(selectedTask);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (!selectedTask) return;
              handleDeleteTask(selectedTask.id);
              handleMenuClose();
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Menu>

      {/* ADD TASK BUTTON */}
      <Button
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateTask(true)}
        sx={{ mt: 1, justifyContent: "flex-start", textTransform: "none" }}
      >
        Add Task
      </Button>

      {/* CREATE TASK MODAL */}
      {openCreateTask && (
        <CreateTaskModal
          columnId={column.id}
          onClose={() => setOpenCreateTask(false)}
          onAddTask={onAddTask}
        />
      )}

      {/* EDIT TASK MODAL */}
      {openEditTask && editTaskData && (
        <EditTaskModal
          task={editTaskData}
          workspaceId={workspaceId} // truyền workspaceId để load user
          onClose={() => setOpenEditTask(false)}
          onSave={handleSaveEditTask}
        />
      )}
    </Paper>
  );
};

export default ColumnContainer;