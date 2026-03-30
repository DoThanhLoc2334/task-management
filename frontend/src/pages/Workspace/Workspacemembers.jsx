import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

import { getUsersInWorkspace } from "../../services/authService";
import { 
  changeMemberRole, 
  removeMemberFromWorkspace, 
  leaveWorkspace 
} from "../../services/workspace";
import { parseToken } from "../../Utils/parseToken";

const WorkspaceMembers = () => {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [roleEditing, setRoleEditing] = useState(null);
  const [roleChanging, setRoleChanging] = useState({});

  // Dialogs
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: "" });
  const [leaveDialog, setLeaveDialog] = useState(false);

  const ROLES = ["owner", "moderator", "member", "guest"];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const userInfo = parseToken(token);
      if (userInfo) {
        setCurrentUserId(userInfo.id);
      }

      try {
        setLoading(true);
        const res = await getUsersInWorkspace(workspaceId);
        const membersData = res.data?.data || [];
        
        // Convert role to lowercase
        const normalizedMembers = membersData.map(m => ({
          ...m,
          role: m.role.toLowerCase()
        }));
        setMembers(normalizedMembers);

        // Set current user role from members list
        if (userInfo) {
          const currentMember = normalizedMembers.find(m => String(m.id) === String(userInfo.id));
          if (currentMember) {
            setCurrentUserRole(currentMember.role);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) fetchData();
  }, [workspaceId]);

  // Change Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      setRoleChanging((prev) => ({ ...prev, [userId]: true }));
      await changeMemberRole(workspaceId, userId, newRole);

      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      );
      setRoleEditing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to change role");
    } finally {
      setRoleChanging((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Remove Member (Owner only)
  const handleOpenDeleteDialog = (userId, userName) => {
    setDeleteDialog({ open: true, userId, userName });
  };

  const handleRemoveMember = async () => {
    try {
      await removeMemberFromWorkspace(workspaceId, deleteDialog.userId);
      setMembers((prev) => prev.filter((m) => m.id !== deleteDialog.userId));
      setDeleteDialog({ open: false, userId: null, userName: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  // Leave Workspace
  const handleOpenLeaveDialog = () => {
    setLeaveDialog(true);
  };

  const handleLeaveWorkspace = async () => {
    try {
      await leaveWorkspace(workspaceId);
      alert("You have successfully left the workspace.");
      navigate("/workspaces");   // Điều hướng về trang danh sách workspace
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to leave workspace");
    } finally {
      setLeaveDialog(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Workspace Members
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => {
              const isCurrentUser = String(member.id) === String(currentUserId);
              const isOwner = currentUserRole === "owner";

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.name}
                    {isCurrentUser && <strong> (You)</strong>}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <strong>
                      {member.role.toUpperCase()}
                    </strong>
                  </TableCell>

                  <TableCell align="center">
                    {/* OWNER: Change Role + Remove */}
                    {currentUserRole === "owner" && !isCurrentUser && (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setRoleEditing(member.id)}
                          disabled={roleEditing === member.id || member.role === "owner"}
                        >
                          {roleEditing === member.id ? "Editing..." : "Change Role"}
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDeleteDialog(member.id, member.name)}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}

                    {/* Role Editing Select */}
                    {roleEditing === member.id && (
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={roleChanging[member.id]}
                        >
                          {ROLES.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role.toUpperCase()}
                            </MenuItem>
                          ))}
                        </Select>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setRoleEditing(null)}
                          sx={{ mt: 0.5 }}
                        >
                          Cancel
                        </Button>
                      </FormControl>
                    )}

                    {/* LEAVE WORKSPACE - Chỉ cho chính mình (Member/Moderator) */}
                    {isCurrentUser && (member.role === "member" || member.role === "moderator") && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<LogoutIcon />}
                        onClick={handleOpenLeaveDialog}
                      >
                        Leave Workspace
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" sx={{ mt: 2, display: "block", color: "#666" }}>
        Roles: owner = all permissions, moderator = CRUD columns, member = CRUD assigned tasks, guest = view/comment only
      </Typography>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, userId: null, userName: "" })}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{deleteDialog.userName}</strong> from this workspace?<br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null, userName: "" })}>Cancel</Button>
          <Button onClick={handleRemoveMember} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Confirmation Dialog */}
      <Dialog open={leaveDialog} onClose={() => setLeaveDialog(false)}>
        <DialogTitle>Leave Workspace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave this workspace?<br />
            You will lose access to all tasks and data here.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialog(false)}>Cancel</Button>
          <Button onClick={handleLeaveWorkspace} color="error" variant="contained">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspaceMembers;