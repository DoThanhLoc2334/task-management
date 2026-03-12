import { workspaces } from "../../mock/mockData";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


const WorkspaceSwitcher = () => {

  const navigate = useNavigate();

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspacedashboard/${workspaceId}`);
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexWrap: "wrap",
        gap: 3
      }}
    >
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          onClick={() => handleWorkspaceClick(workspace.id)}
          sx={{
            width: 260,
            height: 150,
            cursor: "pointer",
            borderRadius: 3,
            transition: "0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6
            }
          }}
        >
          <CardContent>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {workspace.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Workspace ID: {workspace.id}
            </Typography>

          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default WorkspaceSwitcher;