// import { useEffect, useState } from "react";
// import { getWorkspaces } from "../../services/workspace.js";
// import { useNavigate } from "react-router-dom";

// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";

// const WorkspaceSwitcher = ({ refreshFlag }) => {
//   const [workspaces, setWorkspaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleWorkspaceClick = (workspaceId) => {
//     navigate(`/workspacedashboard/${workspaceId}`);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await getWorkspaces();
//         console.log("API response:", res);
//         if (res.success && Array.isArray(res.data)) {
//           setWorkspaces(res.data);
//         } else {
//           setWorkspaces([]);
//         }
//       } catch (err) {
//         console.error("Fetch workspaces error:", err);
//         setError("Failed to load workspaces");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [refreshFlag]); // ✅ re-fetch mỗi khi refreshFlag thay đổi

//   if (loading) {
//     return (
//       <Box sx={{ p: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
//         {[1, 2, 3].map((i) => (
//           <Skeleton
//             key={i}
//             variant="rectangular"
//             width={260}
//             height={150}
//             sx={{ borderRadius: 3 }}
//           />
//         ))}
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   if (workspaces.length === 0) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography>No workspaces available.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4, display: "flex", flexWrap: "wrap", gap: 3 }}>
//       {workspaces.map((workspace) => (
//         <Card
//           key={workspace.id}
//           onClick={() => handleWorkspaceClick(workspace.id)}
//           sx={{
//             width: 260,
//             height: 150,
//             cursor: "pointer",
//             borderRadius: 3,
//             transition: "0.2s",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             "&:hover": {
//               transform: "translateY(-4px)",
//               boxShadow: 6,
//             },
//           }}
//         >
//           <CardContent>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {workspace.name || "No name"}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               {workspace.description || "No description"}
//             </Typography>
//             <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//               ID: {workspace.id || "N/A"}
//             </Typography>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default WorkspaceSwitcher;
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Button,
  Divider
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from "../../services/workspace.js";

function WorkspaceSwitcher({ refreshFlag }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspacedashboard/${workspaceId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getWorkspaces();
        if (res.success && Array.isArray(res.data)) {
          setWorkspaces(res.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshFlag]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fc", py: 6 }}>
      {/* HEADER */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 6, px: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#4669fa", mb: 2 }}
        >
          Task Management
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Your Workspaces
        </Typography>

        <Typography sx={{ color: "#777", mt: 1 }}>
          Select a workspace to continue
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3 }}>
        <Card sx={{ borderRadius: "16px", p: 3 }}>
          <Stack spacing={2}>
            {loading
              ? [1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rounded" height={70} />
                ))
              : workspaces.map((ws, index) => (
                  <Box key={ws.id}>
                    <Box
                      onClick={() => handleWorkspaceClick(ws.id)}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        px: 2,
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "0.2s",
                        '&:hover': {
                          bgcolor: "#f1f3ff"
                        }
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {ws.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Workspace ID: {ws.id}
                        </Typography>
                      </Box>

                      <Typography sx={{ color: "#4669fa", fontWeight: 700 }}>
                        →
                      </Typography>
                    </Box>

                    {index !== workspaces.length - 1 && <Divider />}
                  </Box>
                ))}
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}

export default WorkspaceSwitcher;