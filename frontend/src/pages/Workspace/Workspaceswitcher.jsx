import { useEffect, useState } from "react";
import { getWorkspaces } from "../../services/workspace.js";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const WorkspaceSwitcher = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspacedashboard/${workspaceId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWorkspaces();
        // Lưu ý: api trả về { data: [...] }
        setWorkspaces(res.data.data || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" width={260} height={150} sx={{ borderRadius: 3 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (workspaces.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No workspaces available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
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
              boxShadow: 6,
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {workspace.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {workspace.description}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              ID: {workspace.id}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default WorkspaceSwitcher;