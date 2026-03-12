import { activityLogs, users } from "../../mock/mockData";
import { useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

function WorkspaceActivity() {

  const { id } = useParams(); // id workspace từ URL

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  // lọc log theo workspace
  const workspaceLogs = activityLogs.filter(
    (log) => log.workspace_id === id
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Activity Log
      </Typography>

      <Paper>
        <List>
          {workspaceLogs.map((log) => (
            <ListItem key={log.id} divider>
              <ListItemText
                primary={`${getUserName(log.user_id)} ${log.action}`}
                secondary={log.created_at}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default WorkspaceActivity;