import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Divider,
  IconButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from "../../services/workspace.js";

function WorkspaceSwitcher({ refreshFlag, onRefresh }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await getWorkspaces();
      if (res.success && Array.isArray(res.data)) {
        setWorkspaces(res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [refreshFlag]);

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspacedashboard/${workspaceId}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    try {
      await deleteWorkspace(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetchWorkspaces();
      if (onRefresh) onRefresh(); // nếu muốn parent refresh
    } catch (err) {
      console.error("Delete workspace failed:", err);
      alert("Delete workspace failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fc", py: 6 }}>
      {/* HEADER */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 6, px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#4669fa", mb: 2 }}>
          Task Management
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Your Workspaces
        </Typography>
        <Typography sx={{ color: "#777", mt: 1 }}>Select a workspace to continue</Typography>
      </Box>

      {/* CONTENT */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3 }}>
        <Card sx={{ borderRadius: "16px", p: 3 }}>
          <Stack spacing={2}>
            {loading
              ? [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={70} />)
              : workspaces.map((ws, index) => (
                  <Box key={ws.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        px: 2,
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "0.2s",
                        '&:hover': { bgcolor: "#f1f3ff" },
                      }}
                    >
                      <Box onClick={() => handleWorkspaceClick(ws.id)}>
                        <Typography sx={{ fontWeight: 700 }}>{ws.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Workspace ID: {ws.id}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(ws.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Typography sx={{ color: "#4669fa", fontWeight: 700 }}>→</Typography>
                      </Box>
                    </Box>

                    {index !== workspaces.length - 1 && <Divider />}
                  </Box>
                ))}
          </Stack>
        </Card>
      </Box>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Delete Workspace</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this workspace? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkspaceSwitcher;