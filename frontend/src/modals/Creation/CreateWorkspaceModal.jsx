import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  overflow: "hidden"
};

function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;

    const newWorkspace = {
      id: "ws_" + Date.now(),
      name,
      description,
      created_at: new Date().toISOString()
    };

    onCreate(newWorkspace);
    onClose();
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={style}>
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            color: "white"
          }}
        >
          <Typography fontWeight={700} fontSize={18}>
             Create Workspace
          </Typography>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Workspace name"
              placeholder="Enter workspace name..."
              fullWidth
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Workspaces help you organize projects and teams.
            </Typography>
          </Stack>
        </Box>

        {/* ACTIONS */}
        <Box
          sx={{
            px: 3,
            pb: 2,
            pt: 1,
            display: "flex",
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
            onClick={handleCreate}
            sx={{
              textTransform: "none",
              px: 3,
              borderRadius: 2
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CreateWorkspaceModal;