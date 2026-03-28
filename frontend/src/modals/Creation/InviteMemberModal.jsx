import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import { getUsersNotInWorkspace } from "../../services/authService";
import { addMemberToWorkspace } from "../../services/workspace";

const InviteMemberModal = ({ open, onClose, workspaceId, onInviteSuccess }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !workspaceId) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 Gọi API với workspaceId
        const res = await getUsersNotInWorkspace(workspaceId);

        // 🔹 Lấy đúng mảng users từ backend
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open, workspaceId]);

  const handleInvite = async (user) => {
    try {
      setInviteLoading(true);

      await addMemberToWorkspace(workspaceId, {
        workspace_id: workspaceId,
        user_id: user.id
      });

      // ✅ Xóa user vừa invite khỏi danh sách
      setUsers((prev) => prev.filter((u) => u.id !== user.id));

      if (onInviteSuccess) onInviteSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to invite user");
    } finally {
      setInviteLoading(false);
    }
  };

  // 🔹 Lọc người dùng theo search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Invite Members</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search users..."
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", color: "red", p: 2 }}>{error}</Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: "center", color: "#6F767E", p: 2 }}>
            No users found
          </Box>
        ) : (
          <List>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  <Button
                    variant="contained"
                    size="small"
                    disabled={inviteLoading}
                    onClick={() => handleInvite(user)}
                  >
                    Invite
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar>{user.name?.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;