
import { NavLink } from "react-router-dom";
import { projects } from "../../mock/mockData";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

function Sidebar() {

  return (

    <Box
      sx={{
        width: 260,
        height: "100vh",
        borderRight: "1px solid #e5e7eb",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* Workspace Name */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Software Engineering
      </Typography>

      {/* Navigation */}
      <List>

        <ListItemButton
          component={NavLink}
          to="/workspace"
        >
          Dashboard
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/workspace/members"
        >
          Members
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/workspace/activity"
        >
          Activity
        </ListItemButton>

      </List>

      <Divider sx={{ my: 2 }} />

      {/* Projects */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Projects
      </Typography>

      <List sx={{ flexGrow: 1 }}>

        {projects.map((project) => (

          <ListItemButton
            key={project.id}
            component={NavLink}
            to={`/projects/${project.id}`}
          >
            {project.name}
          </ListItemButton>

        ))}

      </List>

      {/* New Project Button */}
      <Button
        variant="contained"
        fullWidth
      >
        + New Project
      </Button>

    </Box>

  );
}

export default Sidebar;