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
import EditStatusTaskModal from "../../modals/Editing/EditStatusTaskModal.jsx";
import EditAssigneeModal from "../../modals/Editing/EditAssigneeModal.jsx";
const ColumnContainer = ({ column, workspaceId, tasks = [], loadingTasks = false, onAddTask }) => {
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);

  const [openEditStatus, setOpenEditStatus] = useState(false);
  const [editStatusData, setEditStatusData] = useState(null);
  const [openEditAssignee, setOpenEditAssignee] = useState(false);
  const [editAssigneeData, setEditAssigneeData] = useState(null);

  const handleEditAssignee = (task) => {
    setEditAssigneeData(task);
    setOpenEditAssignee(true);
  }
  const handleSaveEditAssignee = async () => {
    await onAddTask(); // refresh danh sách task
    setOpenEditAssignee(false);
    setEditAssigneeData(null);
  }
  const handleEditStatus = (task) => {
    setEditStatusData(task);
    setOpenEditStatus(true);
  };

  const handleSaveEditStatus = async () => {
    await onAddTask(); // reload tasks
    setOpenEditStatus(false);
    setEditStatusData(null);
  };
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
                    position: "relative",
                    transition: "0.2s",

                  
                    opacity: task.status === "done" ? 0.5 : 1,
                    
                    "&:hover": {
                      backgroundColor: "#e4e6ea",
                      transform: "translateY(-2px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }
                  }}
                >
                                
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
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  sx={{
                    textDecoration: task.status === "done" ? "line-through" : "none"
                  }}
                >
                  {task.title}
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    display: "inline-block",
                    px: 1,
                    py: "2px",
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "white",

             
                    backgroundColor:
                      task.status === "todo"
                        ? "#777777"
                        : task.status === "in_progress"
                        ? "#ff9800"
                        : "#4caf50"
                  }}
                >
                  {task.status === "todo"
                    ? "To Do"
                    : task.status === "in_progress"
                    ? "In Progress"
                    : "Done"}
                </Box>
            

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
              handleEditAssignee(selectedTask);
              handleMenuClose();
            }}
          >
            Assign
          </MenuItem>
          <MenuItem
              onClick={() => {
                if (!selectedTask) return;
                handleEditStatus(selectedTask); // ✅ thêm dòng này
                handleMenuClose();
              }}
          >
              Edit Status
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
      {openEditStatus && editStatusData && (
        <EditStatusTaskModal
          task={editStatusData}
          open={openEditStatus}
          onClose={() => setOpenEditStatus(false)}
          onSave={handleSaveEditStatus}
        />
      )}
      {openEditAssignee && editAssigneeData && (
        <EditAssigneeModal
          task={editAssigneeData}
          workspaceId={workspaceId}
          open={openEditAssignee}
          onClose={() => setOpenEditAssignee(false)}
          onSave={handleSaveEditAssignee}
        />
      )}
    </Paper>
  );
};

export default ColumnContainer;