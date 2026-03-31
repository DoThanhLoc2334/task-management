import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  MenuItem
} from "@mui/material";

import { updateTask } from "../../services/task.service";
import { getUsersInWorkspace } from "../../services/authService";

function EditAssigneeModal({ task, workspaceId, open, onClose, onSave }) {
  const [assigneeId, setAssigneeId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersInWorkspace(workspaceId);
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (open && workspaceId) fetchUsers();
  }, [workspaceId, open]);

  // sync task
  useEffect(() => {
    if (task) {
      setAssigneeId(task.assignee_id || "");
    }
  }, [task]);

  // tránh crash
  if (!task) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      await updateTask(task.id, {
        assignee_id: assigneeId || null
      });

      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update assignee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, backgroundColor: "#f5f5f5" }}>
        Assign Task
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          <TextField
            label="Assign To"
            select
            fullWidth
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <MenuItem value="">-- None --</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditAssigneeModal;