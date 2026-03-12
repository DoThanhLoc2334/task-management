import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { workspaces, projects, users } from "../../mock/mockData";

import InviteMemberModal from "../../modals/Creation/InviteMemberModal";

import Button from "@mui/material/Button";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Box,
  Paper
} from "@mui/material";

const WorkspaceDashboard = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [openInvite, setOpenInvite] = useState(false);

  const workspace = workspaces.find((w) => w.id === id);

  const workspaceProjects = projects.filter(
    (project) => project.workspace_id === id
  );

  const handleMembersClick = () => {
    navigate(`/workspace/${id}/members`);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleActivityClick = () => {
    navigate(`/workspace/${id}/activity`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>

      {/* WORKSPACE HEADER */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>

        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <Box>

            <Typography variant="h4" fontWeight="bold">
              {workspace?.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {workspace?.description}
            </Typography>

          </Box>

          <Stack direction="row" spacing={2}>

            <Button
              variant="outlined"
              onClick={() => setOpenInvite(true)}
            >
              Invite Members
            </Button>

            <Button
              variant="outlined"
              onClick={handleMembersClick}
            >
              Members
            </Button>

            <Button
              variant="contained"
              onClick={handleActivityClick}
            >
              Activity Log
            </Button>

          </Stack>

        </Stack>

      </Paper>

      {/* PROJECT SECTION */}

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Projects
      </Typography>

      <Grid container spacing={3}>

        {workspaceProjects.map((project) => {

          const admin = users.find((u) => u.id === project.admin_id);

          return (

            <Grid item xs={12} sm={6} md={4} key={project.id}>

              <Card
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  transition: "0.25s",
                  height: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6
                  }
                }}
              >

                <CardContent>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {project.name}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">

                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: "primary.main",
                        fontSize: 14
                      }}
                    >
                      {admin?.name?.charAt(0)}
                    </Avatar>

                    <Typography variant="body2" color="text.secondary">
                      {admin?.name}
                    </Typography>

                  </Stack>

                </CardContent>

              </Card>

            </Grid>

          );

        })}

      </Grid>

      {/* INVITE MODAL */}

      <InviteMemberModal
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        workspaceId={id}
      />

    </Container>
  );
};

export default WorkspaceDashboard;