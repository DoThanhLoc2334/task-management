import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

function CreateWorkspaceModal({ onClose, onCreate }) {

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleCreate = () => {

    if (!name.trim()) return;

    const newWorkspace = {
      id: "ws_" + Date.now(),
      name: name,
      description: description,
      created_at: new Date().toISOString()
    };

    onCreate(newWorkspace);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>

        <Typography variant="h6" mb={2}>
          Create Workspace
        </Typography>

        <TextField
          fullWidth
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Workspace description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1
          }}
        >
          <Button onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Create
          </Button>

        </Box>

      </Box>
    </Modal>
  );
}

export default CreateWorkspaceModal;