import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, CircularProgress, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTaskModal from "../../modals/Creation/CreateTaskModal";
import EditTaskModal from "../../modals/Editing/EditTaskModal.jsx";
import { deleteTask, reorderTask } from "../../services/task.service.js";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditStatusTaskModal from "../../modals/Editing/EditStatusTaskModal.jsx";
import EditAssigneeModal from "../../modals/Editing/EditAssigneeModal.jsx";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
const ColumnContainer = ({ column, workspaceId, tasks = [], loadingTasks = false, onAddTask }) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);

  const [openEditStatus, setOpenEditStatus] = useState(false);
  const [editStatusData, setEditStatusData] = useState(null);
  const [openEditAssignee, setOpenEditAssignee] = useState(false);
  const [editAssigneeData, setEditAssigneeData] = useState(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = localTasks.findIndex((task) => task.id === active.id);
    const newIndex = localTasks.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const updatedTasks = arrayMove(localTasks, oldIndex, newIndex);
    setLocalTasks(updatedTasks);

    const movedIndex = updatedTasks.findIndex((task) => task.id === active.id);
    const beforeId = updatedTasks[movedIndex - 1]?.id || null;
    const afterId = updatedTasks[movedIndex + 1]?.id || null;

    try {
      await reorderTask(active.id, beforeId, afterId);
      await onAddTask();
    } catch (err) {
      console.error("Reorder failed:", err);
      setLocalTasks(tasks);
    }
  };

  function SortableTaskRow({ task }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <Paper
        ref={setNodeRef}
        style={style}
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: "grab",
              color: "#888",
              mr: 1,
              fontSize: 14
            }}
          >
            ⋮⋮
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e, task);
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography
          fontSize={14}
          fontWeight={600}
          sx={{
            textDecoration: task.status === "done" ? "line-through" : "none"
          }}
        >
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

        {task.assignee ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#1976d2",
                color: "white",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {task.assignee.name.charAt(0).toUpperCase()}
            </Box>
            <Typography fontSize={11}>{task.assignee.name}</Typography>
          </Box>
        ) : (
          <Typography fontSize={11} color="gray" mt={0.5}>
            👤 Unassigned
          </Typography>
        )}
      </Paper>
    );
  }

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
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          '&::-webkit-scrollbar': {
            width: 0,
            height: 0
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {loadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : localTasks.length === 0 ? (
          <Typography fontSize={12} color="gray">No tasks</Typography>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {localTasks.map((task) => (
                <SortableTaskRow key={task.id} task={task} />
              ))}
            </SortableContext>
          </DndContext>
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