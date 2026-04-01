import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Divider
} from "@mui/material";

function CreateProjectModal({ onClose, onCreate }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onCreate({
      name: projectName,
      description
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      {/* HEADER */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 18,
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white"
        }}
      >
        Create New Project
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2.5}>
          <TextField
            label="Project name"
            placeholder="Enter project name..."
            fullWidth
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <TextField
            label="Description"
            placeholder="Optional description..."
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Divider />

          <Typography fontSize={12} color="gray">
            Tip: Keep project names short and clear 
          </Typography>
        </Stack>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 1,
          justifyContent: "space-between"
        }}
      >
        <Button
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateProjectModal;