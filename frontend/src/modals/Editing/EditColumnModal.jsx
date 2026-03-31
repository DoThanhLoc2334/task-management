import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";

function EditColumnModal({ open, onClose, column, onSave }) {
  const [columnName, setColumnName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Khi mở modal, set columnName từ column hiện tại
  useEffect(() => {
    if (column) {
      setColumnName(column.name || "");
      setError("");
    }
  }, [column]);

  const handleSave = async () => {
    if (!columnName.trim()) {
      setError("Column name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSave(columnName);

      setColumnName("");
    } catch (err) {
      setError("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // đang loading thì không cho đóng
    setColumnName(column?.name || "");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Column</DialogTitle>

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
          onClick={handleSave}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditColumnModal;