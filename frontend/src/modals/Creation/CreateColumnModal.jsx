import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";

function CreateColumnModal({ open, onClose, onCreate }) {
  const [columnName, setColumnName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!columnName.trim()) {
      setError("Column name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onCreate(columnName);

      setColumnName("");
      onClose();
    } catch (err) {
      setError("Create failed",err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // đang loading thì không cho đóng
    setColumnName("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Column</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          error={!!error}
          helperText={error}
          autoFocus
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateColumnModal;