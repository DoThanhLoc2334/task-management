import React, { useState, useEffect } from "react";
import { getTaskById } from "../../services/task.service.js";
import { useParams, useNavigate } from "react-router-dom";

// Components
import LabelBadge from "../../components/task/LabelBadge";
import AssigneeAvatar from "../../components/task/AssigneeAvatar";
// import CommentThread from "../../components/task/CommentThread";
import AttachmentList from "../../components/task/AttachmentList";

// Modals
import AddCommentModal from "../../modals/Task/AddCommentModal";
import UploadAttachmentModal from "../../modals/Task/UploadAttachmentModal";
import ChangeLabelModal from "../../modals/Task/ChangeLabelModal";
import ChangeAssigneeModal from "../../modals/Task/ChangeAssigneeModal";
import AddDependencyModal from "../../modals/Task/AddDependencyModal";

// Icons
import {
  AddCircleOutline,
  CloudUploadOutlined,
  LabelOutlined,
  PersonAddOutlined,
  AccessTime,
  LinkOutlined,
  ArrowBack,
  CalendarTodayOutlined,
  CheckCircleOutline,
  EditOutlined
} from "@mui/icons-material";

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  Box,
  IconButton,
  Paper,
  Chip,
  LinearProgress
} from "@mui/material";

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(taskId);
        setTask(res.data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const assignee = task?.assignee;

  const [openComment, setOpenComment] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);
  const [openAssignee, setOpenAssignee] = useState(false);
  const [openDependency, setOpenDependency] = useState(false);

  if (loading) {
  return (
    <Container sx={{ textAlign: 'center', mt: 6 }}>
      <CircularProgress />
    </Container>
  );
}

if (!task) {
  return (
    <Container sx={{ textAlign: 'center', mt: 6 }}>
      <Typography variant="h6" color="error">
        Task not found
      </Typography>
    </Container>
  );
}

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>

        {/* BACK BUTTON & HEADER */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              textTransform: "none",
              color: "#666",
              "&:hover": { bgcolor: "#f5f5f5" }
            }}
          >
            Back to Board
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CheckCircleOutline sx={{ fontSize: 32, color: "#1976d2" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#1a1a1a",
                flex: 1
              }}
            >
              {task.title}
            </Typography>
            <Button
              startIcon={<EditOutlined />}
              variant="outlined"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Edit
            </Button>
          </Box>

          <Typography variant="body2" color="textSecondary">
            Task ID: {task.id} • Created on {task.start_date}
          </Typography>
        </Box>

        <Grid container spacing={3}>

          {/* MAIN CONTENT - LEFT SIDE (8 cols) */}
          <Grid item xs={12} md={8}>

            {/* DESCRIPTION CARD */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "#1a1a1a",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  📝 Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    lineHeight: 1.8,
                    p: 2,
                    bgcolor: "#f9f9f9",
                    borderRadius: 1,
                    borderLeft: "3px solid #1976d2"
                  }}
                >
                  {task.description || "No description provided for this task."}
                </Typography>
              </CardContent>
            </Card>

            {/* ATTACHMENTS CARD */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    📎 Attachments
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CloudUploadOutlined />}
                    onClick={() => setOpenAttachment(true)}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      bgcolor: "#1976d2"
                    }}
                  >
                    Upload File
                  </Button>
                </Stack>
                <AttachmentList files={task.attachments || []} />
              </CardContent>
            </Card>

            {/* COMMENTS CARD */}
            <Card
              sx={{
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    💬 Comments
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleOutline />}
                    onClick={() => setOpenComment(true)}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      bgcolor: "#26c281"
                    }}
                  >
                    Add Comment
                  </Button>
                </Stack>

              </CardContent>
            </Card>
          </Grid>

          {/* SIDEBAR - RIGHT SIDE (4 cols) */}
          <Grid item xs={12} md={4}>

            {/* PROGRESS & STATUS */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <CardContent sx={{ p: 3, color: "white" }}>
                <Typography variant="overline" sx={{ fontWeight: 700, opacity: 0.9 }}>
                  Progress
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  67%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={67}
                  sx={{
                    mb: 2,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": { backgroundColor: "white" }
                  }}
                />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  On track • Due in 4 days
                </Typography>
              </CardContent>
            </Card>

            {/* ASSIGNEE CARD */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 700, color: "#666", mb: 1.5 }}
                >
                  👤 Assigned To
                </Typography>
                {assignee?.name?.charAt(0) ? (
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "#1976d2",
                          color: "white",
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: 18
                        }}
                      >
                        {assignee.name.charAt(0)}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {assignee.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {assignee.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<PersonAddOutlined />}
                      onClick={() => setOpenAssignee(true)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 1
                      }}
                    >
                      Change Assignee
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAddOutlined />}
                    onClick={() => setOpenAssignee(true)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1
                    }}
                  >
                    Add Assignee
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* DUE DATE CARD */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 700, color: "#666", mb: 1.5 }}
                >
                  📅 Due Date
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    p: 1.5,
                    bgcolor: "#fff3e0",
                    borderRadius: 1,
                    borderLeft: "3px solid #ff9800"
                  }}
                >
                  <CalendarTodayOutlined sx={{ color: "#ff9800" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#e65100" }}>
                    {task.due_date || "No due date"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* LABELS CARD */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 700, color: "#666", mb: 1.5 }}
                >
                  🏷️ Labels
                </Typography>
                <Stack spacing={1}>
                  {task.labels && task.labels.length > 0 ? (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {task.labels.map((label) => (
                        <Chip
                          key={label.id}
                          label={label.name}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No labels
                    </Typography>
                  )}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<LabelOutlined />}
                    onClick={() => setOpenLabel(true)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1,
                      mt: 1
                    }}
                  >
                    Manage Labels
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* DEPENDENCIES CARD */}
            <Card
              sx={{
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 700, color: "#666", mb: 1.5 }}
                >
                  🔗 Dependencies
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<LinkOutlined />}
                  onClick={() => setOpenDependency(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 1,
                    borderStyle: "dashed"
                  }}
                >
                  Add Dependency
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* MODALS */}
        {openComment && <AddCommentModal onClose={() => setOpenComment(false)} />}
        {openAttachment && <UploadAttachmentModal onClose={() => setOpenAttachment(false)} />}
        {openLabel && <ChangeLabelModal onClose={() => setOpenLabel(false)} />}
        {openAssignee && <ChangeAssigneeModal onClose={() => setOpenAssignee(false)} />}
        {openDependency && <AddDependencyModal onClose={() => setOpenDependency(false)} />}
      </Box>
    </Box>
  );
}

export default TaskDetail;