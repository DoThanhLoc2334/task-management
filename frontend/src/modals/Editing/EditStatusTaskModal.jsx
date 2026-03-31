import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  CircularProgress,
  TextField,
  MenuItem
} from "@mui/material";

import { updateTask } from "../../services/task.service";

function EditStatusTaskModal({ task, open, onClose, onSave }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // sync data khi mở modal
  useEffect(() => {
    if (task) {
      setStatus(task.status || "");
    }
  }, [task]);

  // ❗ tránh crash khi chưa có task
  if (!task) return null;

  const handleSubmit = async () => {
    if (!status) return;

    try {
      setLoading(true);
      setError("");

      await updateTask(task.id, { status });

      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, backgroundColor: "#f5f5f5" }}>
        Update Status
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          <TextField
            label="Status"
            select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !status}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditStatusTaskModal;