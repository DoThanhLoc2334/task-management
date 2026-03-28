import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { getUsersInWorkspace } from "../../services/authService";
import { changeMemberRole } from "../../services/workspace";

const WorkspaceMembers = ({ currentUserRole }) => {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleEditing, setRoleEditing] = useState(null); // userId đang edit role
  const [roleChanging, setRoleChanging] = useState({}); // track loading per user

  const ROLES = ["owner", "moderator", "member", "guest"];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await getUsersInWorkspace(id);
        setMembers(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMembers();
  }, [id]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setRoleChanging((prev) => ({ ...prev, [userId]: true }));
      await changeMemberRole(id, userId, newRole);
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

  if (members.length === 0)
    return (
      <Typography align="center" mt={4}>
        No members found in this workspace.
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Workspace Members
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              {(currentUserRole === "owner" || currentUserRole === "moderator") && (
                <TableCell><strong>Actions</strong></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                {(currentUserRole === "owner" || currentUserRole === "moderator") && (
                  <TableCell>
                    {roleEditing === member.id ? (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={roleChanging[member.id]}
                        >
                          {ROLES.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setRoleEditing(null)}
                          sx={{ mt: 1 }}
                        >
                          Cancel
                        </Button>
                      </FormControl>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setRoleEditing(member.id)}
                        disabled={member.role === "owner"} // owner không thể đổi
                      >
                        Change Role
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        Roles: owner = all permissions, moderator = CRUD columns, member = CRUD assigned tasks, guest = view/comment only
      </Typography>
    </Box>
  );
};

export default WorkspaceMembers;