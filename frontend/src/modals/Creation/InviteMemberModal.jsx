import { useState } from "react";
import { users, workspaceMembers, activityLogs } from "../../mock/mockData";
import { v4 as uuidv4 } from "uuid";
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
  Stack
} from "@mui/material";

const InviteMemberModal = ({ open, onClose, workspaceId }) => {

  const [search, setSearch] = useState("");

  const members = workspaceMembers
    .filter((m) => m.workspace_id === workspaceId)
    .map((m) => m.user_id);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (user) => {

  const logId = uuidv4();

    workspaceMembers.push({
      workspace_id: workspaceId,
      user_id: user.id
    });

    activityLogs.push({
      id: logId,
      workspace_id: workspaceId,
      user_id: user.id,
      action: "joined workspace",
      created_at: new Date().toLocaleString()
    });

    alert(`${user.name} invited`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle>
        Invite Members
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          placeholder="Search users..."
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <List>

          {filteredUsers.map((user) => {

            const invited = members.includes(user.id);

            return (

              <ListItem
                key={user.id}
                secondaryAction={

                  <Button
                    variant="contained"
                    size="small"
                    disabled={invited}
                    onClick={() => handleInvite(user)}
                  >
                    {invited ? "Invited" : "Invite"}
                  </Button>

                }
              >

                <ListItemAvatar>
                  <Avatar>
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={user.name}
                  secondary={user.email}
                />

              </ListItem>

            );

          })}

        </List>

      </DialogContent>

    </Dialog>
  );
};

export default InviteMemberModal;