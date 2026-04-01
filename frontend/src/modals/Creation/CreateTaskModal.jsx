
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Stack,
//   Typography,
//   CircularProgress,
//   Paper
// } from "@mui/material";

// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import dayjs from "dayjs";

// import { createTask } from "../../services/task.service";
// import { parseToken } from "../../Utils/parseToken";

// function CreateTaskModal({ columnId, onClose, onAddTask }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [startDate, setStartDate] = useState(dayjs());
//   const [dueDate, setDueDate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("accessToken");
//   const user = parseToken(token);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     try {
//       setLoading(true);
//       setError("");

//       const payload = {
//         column_id: columnId,
//         title,
//         description,
//         created_by: user?.id,
//         start_date: startDate ? startDate.toISOString() : dayjs().toISOString(),
//         due_date: dueDate ? dueDate.toISOString() : null
//       };

//       const res = await createTask(payload);
//       const newTask = res.data;

//       onAddTask(newTask);

//       setTitle("");
//       setDescription("");
//       setStartDate(dayjs());
//       setDueDate(null);

//       onClose();
//     } catch (err) {
//       console.error(err);
//       setError("Failed to create task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
//       <Paper elevation={3} sx={{ borderRadius: 2 }}>
//         <DialogTitle sx={{ fontWeight: 600, backgroundColor: "#f5f5f5" }}>
//           Create New Task
//         </DialogTitle>

//         <DialogContent>
//           <Stack spacing={2} mt={1}>
//             {error && (
//               <Typography color="error" fontSize={14}>
//                 {error}
//               </Typography>
//             )}

//             <TextField
//               label="Title"
//               fullWidth
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />

//             <TextField
//               label="Description"
//               fullWidth
//               multiline
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <DateTimePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => setStartDate(newValue)}
//                 disablePast
//                 minutesStep={5}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//               />

//               <DateTimePicker
//                 label="Due Date"
//                 value={dueDate}
//                 onChange={(newValue) => setDueDate(newValue)}
//                 disablePast
//                 minutesStep={5}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//               />
//             </Stack>
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={20} /> : "Create"}
//           </Button>
//         </DialogActions>
//       </Paper>
//     </Dialog>
//   );
// }

// export default CreateTaskModal;
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
  Box,
  Divider
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
        start_date: startDate?.toISOString(),
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
      {/* HEADER */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 18,
          pb: 1,
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white"
        }}
      >
         Create New Task
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2.5}>
          {error && (
            <Typography color="error" fontSize={13}>
              {error}
            </Typography>
          )}

          {/* TITLE */}
          <TextField
            label="Task title"
            placeholder="Enter task title..."
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESCRIPTION */}
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

          {/* DATE SECTION */}
          <Box>
            <Typography fontSize={13} fontWeight={600} mb={1}>
              Schedule
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <DateTimePicker
                label="Start"
                value={startDate}
                onChange={setStartDate}
                disablePast
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />

              <DateTimePicker
                label="Due"
                value={dueDate}
                onChange={setDueDate}
                disablePast
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Stack>
          </Box>
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
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTaskModal;