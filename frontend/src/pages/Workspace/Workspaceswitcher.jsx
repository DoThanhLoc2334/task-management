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
// import { getWorkspaces, deleteWorkspace } from "../../services/workspace.js";
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
      // await deleteWorkspace(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetchWorkspaces();
      if (onRefresh) onRefresh(); // nếu muốn parent refresh
    } catch (err) {
      console.error("Delete workspace failed:", err);
      alert("Delete workspace failed");
    }
  };

  // return (
  //   <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fc", py: 6 }}>
  //     {/* HEADER */}
  //     <Box sx={{ maxWidth: 900, mx: "auto", mb: 6, px: 3 }}>
  //       <Typography variant="h5" sx={{ fontWeight: 800, color: "#4669fa", mb: 2 }}>
  //         Task Management
  //       </Typography>
  //       <Typography variant="h4" sx={{ fontWeight: 800 }}>
  //         Your Workspaces
  //       </Typography>
  //       <Typography sx={{ color: "#777", mt: 1 }}>Select a workspace to continue</Typography>
  //     </Box>

  //     {/* CONTENT */}
  //     <Box sx={{ maxWidth: 900, mx: "auto", px: 3 }}>
  //       <Card sx={{ borderRadius: "16px", p: 3 }}>
  //         <Stack spacing={2}>
  //           {loading
  //             ? [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={70} />)
  //             : workspaces.map((ws, index) => (
  //                 <Box key={ws.id}>
  //                   <Box
  //                     sx={{
  //                       display: "flex",
  //                       justifyContent: "space-between",
  //                       alignItems: "center",
  //                       py: 2,
  //                       px: 2,
  //                       borderRadius: "10px",
  //                       cursor: "pointer",
  //                       transition: "0.2s",
  //                       '&:hover': { bgcolor: "#f1f3ff" },
  //                     }}
  //                   >
  //                     <Box onClick={() => handleWorkspaceClick(ws.id)}>
  //                       <Typography sx={{ fontWeight: 700 }}>{ws.name}</Typography>
  //                       <Typography variant="caption" color="text.secondary">
  //                         Workspace ID: {ws.id}
  //                       </Typography>
  //                     </Box>

  //                     <Box sx={{ display: "flex", gap: 1 }}>
  //                       <IconButton
  //                         size="small"
  //                         color="error"
  //                         onClick={() => handleDeleteClick(ws.id)}
  //                       >
  //                         <DeleteIcon />
  //                       </IconButton>
  //                       <Typography sx={{ color: "#4669fa", fontWeight: 700 }}>→</Typography>
  //                     </Box>
  //                   </Box>

  //                   {index !== workspaces.length - 1 && <Divider />}
  //                 </Box>
  //               ))}
  //         </Stack>
  //       </Card>
  //     </Box>

  //     {/* DELETE CONFIRM DIALOG */}
  //     <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
  //       <DialogTitle>Delete Workspace</DialogTitle>
  //       <DialogContent>
  //         Are you sure you want to delete this workspace? This action cannot be undone.
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
  //         <Button color="error" onClick={confirmDelete}>
  //           Delete
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   </Box>
  // );
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", py: 6 }}>
      {/* HEADER */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mb: 5,
          px: 3,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
        }}
      >
        <Typography fontSize={14} sx={{ opacity: 0.9 }}>
          Workspace
        </Typography>
        <Typography variant="h5" fontWeight={700}>
           Your Workspaces
        </Typography>
        <Typography fontSize={13} sx={{ opacity: 0.85 }}>
          Select a workspace to continue working
        </Typography>
      </Box>

      {/* GRID CONTENT */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          px: 3,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 3
        }}
      >
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" height={140} />
            ))
          : workspaces.map((ws) => (
              <Card
                key={ws.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.25s",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.12)"
                  }
                }}
                onClick={() => handleWorkspaceClick(ws.id)}
              >
                {/* DELETE BUTTON */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(ws.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#ef5350",
                    "&:hover": {
                      backgroundColor: "rgba(239,83,80,0.1)"
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                {/* CONTENT */}
                <Stack spacing={1}>
                  <Typography fontWeight={700} fontSize={16}>
                    {ws.name}
                  </Typography>

                  <Typography fontSize={12} color="gray">
                    Workspace description: {ws.description || "No description"}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography
                    fontSize={12}
                    sx={{ color: "#1976d2", fontWeight: 600 }}
                  >
                    Open Workspace →
                  </Typography>
                </Stack>
              </Card>
            ))}
      </Box>

      {/* DELETE DIALOG */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #ef5350, #e53935)",
            color: "white"
          }}
        >
          ⚠️ Delete Workspace
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Typography fontSize={14}>
            Are you sure you want to delete this workspace?
          </Typography>
          <Typography fontSize={13} color="gray">
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>

          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#ef5350",
              "&:hover": {
                backgroundColor: "#d32f2f"
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkspaceSwitcher;