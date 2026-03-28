
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getWorkspaceById } from "../../services/workspace";
import { getProjects } from "../../services/projectsServices";
import InviteMemberModal from "../../modals/Creation/InviteMemberModal";

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
  CircularProgress,
  Divider,
  Avatar
} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const wsRes = await getWorkspaceById(id); // wsRes lúc này là object {success, data, message}
        const pjRes = await getProjects(id);

        // SỬA TẠI ĐÂY:
        // Vì API trả về data là Object trực tiếp (xem ảnh 1)
        setWorkspace(wsRes.data || null); 
        
        // Vì API dự án trả về data là Mảng (xem ảnh 2)
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#4669fa' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2, color: '#4669fa' }}>Try Again</Button>
      </Box>
    );
  }

  if (!workspace || workspace.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
        <Typography variant="h6">No workspace found.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Back</Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* HEADER - Nâng cấp giao diện Paper */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          mb: 6, 
          border: '1px solid #f0f0f0',
          background: 'linear-gradient(to right, #ffffff, #fcfcff)' 
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: '#4669fa', 
                width: 60, 
                height: 60, 
                fontSize: '1.5rem', 
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(70,105,250,0.2)'
              }}
            >
              {workspace.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A1D1F', mb: 0.5 }}>
                {workspace.name || "No Name"}
              </Typography>
              <Typography sx={{ color: '#6F767E', fontWeight: 500 }}>
                {workspace.description || "No description provided"}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<GroupIcon />}
              onClick={() => setInviteOpen(true)}
            >
              Invite Member
            </Button>

            <InviteMemberModal
              open={inviteOpen}
              onClose={() => setInviteOpen(false)}
              workspaceId={id}
              onInviteSuccess={() => {
                // có thể reload workspace members nếu cần
                console.log("User invited successfully");
              }}
            />
            <Button 
              variant="outlined" 
              onClick={handleMembersClick}
              startIcon={<GroupIcon />}
              sx={{ 
                borderRadius: '10px', 
                textTransform: 'none', 
                fontWeight: 600, 
                borderColor: '#EFEFEF',
                color: '#1A1D1F',
                '&:hover': { borderColor: '#4669fa', bgcolor: 'transparent' }
              }}
            >
              Members
            </Button>
            <Button 
              variant="contained" 
              onClick={handleActivityClick}
              startIcon={<AssessmentIcon />}
              disableElevation
              sx={{ 
                borderRadius: '10px', 
                textTransform: 'none', 
                fontWeight: 600, 
                bgcolor: '#4669fa',
                '&:hover': { bgcolor: '#3552db' }
              }}
            >
              Activity
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {projects.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #EFEFEF' }}>
          <Typography sx={{ color: '#9A9FA5' }}>No projects found in this workspace.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 4,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                    borderColor: '#4669fa'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ p: 0.8, bgcolor: '#F4F7FF', borderRadius: 1.5, color: '#4669fa', display: 'flex' }}>
                      <AssessmentIcon fontSize="small" />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A1D1F' }} noWrap>
                      {project.name || "No Name"}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2, opacity: 0.5 }} />
                  
                  <Typography variant="body2" sx={{ color: "#6F767E", height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {project.description || "No description provided."}
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