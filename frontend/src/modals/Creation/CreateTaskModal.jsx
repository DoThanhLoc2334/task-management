
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
  CircularProgress,
  Paper
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import { createTask } from "../../services/task.service";
import { parseToken } from "../../Utils/parseToken";

function CreateTaskModal({ columnId, onClose, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [dueDate, setDueDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const user = parseToken(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        column_id: columnId,
        title,
        description,
        created_by: user?.id,
        start_date: startDate ? startDate.toISOString() : dayjs().toISOString(),
        due_date: dueDate ? dueDate.toISOString() : null
      };

      const res = await createTask(payload);
      const newTask = res.data;

      onAddTask(newTask);

      setTitle("");
      setDescription("");
      setStartDate(dayjs());
      setDueDate(null);

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <DialogTitle sx={{ fontWeight: 600, backgroundColor: "#f5f5f5" }}>
          Create New Task
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
            {loading ? <CircularProgress size={20} /> : "Create"}
          </Button>
        </DialogActions>
      </Paper>
    </Dialog>
  );
}

export default CreateTaskModal;