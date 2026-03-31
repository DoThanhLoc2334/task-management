
import React, { useState } from "react";
import { Box, Typography, Paper, Button, CircularProgress,Stack  } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTaskModal from "../../modals/Creation/CreateTaskModal";

const ColumnContainer = ({ column, tasks = [], loadingTasks = false, onAddTask }) => {
  const [openCreateTask, setOpenCreateTask] = useState(false);

  return (
    <Paper
      sx={{
        width: 300,
        p: 2,
        borderRadius: 3,
        backgroundColor: "#f4f5f7",
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh"
      }}
    >
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
          gap: 1
        }}
      >
        {loadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography fontSize={12} color="gray">
            No tasks
          </Typography>
        ) : (
          tasks.map((task) => (
            <Paper
              key={task.id}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#e4e6ea",
                  transform: "translateY(-2px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }
              }}
              onClick={() => console.log("Click task:", task.id)} // sau này mở TaskDetail
            >
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
                  Due:{" "}
                  {new Date(task.due_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </Typography>
              )}
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Paper>
          ))
        )}
      </Box>

      {/* ADD TASK BUTTON */}
      <Button
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateTask(true)}
        sx={{
          mt: 1,
          justifyContent: "flex-start",
          textTransform: "none"
        }}
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
    </Paper>
  );
};

export default ColumnContainer;