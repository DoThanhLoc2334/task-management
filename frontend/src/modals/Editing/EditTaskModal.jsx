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

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import { updateTask } from "../../services/task.service";
import { getUsersInWorkspace } from "../../services/authService";

function EditTaskModal({ task, workspaceId, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [startDate, setStartDate] = useState(task?.start_date ? dayjs(task.start_date) : dayjs());
  const [dueDate, setDueDate] = useState(task?.due_date ? dayjs(task.due_date) : null);
  const [assigneeId, setAssigneeId] = useState(task?.assignee_id || "");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersInWorkspace(workspaceId);
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (workspaceId) fetchUsers();
  }, [workspaceId]);

  // Update state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartDate(task.start_date ? dayjs(task.start_date) : dayjs());
      setDueDate(task.due_date ? dayjs(task.due_date) : null);
      setAssigneeId(task.assignee_id || "");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        start_date: startDate ? startDate.toISOString() : undefined,
        due_date: dueDate ? dueDate.toISOString() : undefined,
        assignee_id: assigneeId || undefined
      };

      await updateTask(task.id, payload);
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, backgroundColor: "#f5f5f5" }}>
        Edit Task
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              disablePast
              minutesStep={5}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />

            <DateTimePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              disablePast
              minutesStep={5}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Stack>

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

export default EditTaskModal;