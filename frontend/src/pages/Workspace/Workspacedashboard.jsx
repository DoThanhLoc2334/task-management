import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getWorkspaceById } from "../../services/workspace";
import { getProjects } from "../../services/projectsServices";

import Button from "@mui/material/Button";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Box,
  Paper,
  CircularProgress
} from "@mui/material";

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const wsRes = await getWorkspaceById(id);
        const pjRes = await getProjects(id);

        // Lấy workspace đầu tiên
        setWorkspace(wsRes.data?.data?.[0] || []);
        setProjects(pjRes.data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load workspace or projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMembersClick = () => {
    navigate(`/workspace/${id}/members`);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleActivityClick = () => {
    navigate(`/workspace/${id}/activity`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!workspace) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>No workspace found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* HEADER */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {workspace.name || "No Name"}
            </Typography>
            <Typography color="text.secondary">
              {workspace.description || "No description"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined">Invite Members</Button>
            <Button variant="outlined" onClick={handleMembersClick}>
              Members
            </Button>
            <Button variant="contained" onClick={handleActivityClick}>
              Activity
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* PROJECTS */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Projects
      </Typography>

      {projects.length === 0 ? (
        <Typography>No projects found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  height: 140,
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography fontWeight="bold" noWrap>
                    {project.name || "No Name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {project.description || "No description"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WorkspaceDashboard;