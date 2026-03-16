import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useLocation } from "react-router-dom";
import React from "react";

import { workspaces } from "../../mock/mockData";

import CreateWorkspaceModal from "../../modals/Creation/CreateWorkspaceModal";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";
import CreateProjectModal from "../../modals/Creation/CreateProjectModal";

function Topbar() {

  const location = useLocation();
  const [openModal, setOpenModal] = React.useState(false);

  const getCreateLabel = () => {
    if (location.pathname.includes("/workspaceswitcher")) return "+ Workspace";
    if (location.pathname.includes("/projects")) return "+ Column";
    if (location.pathname.includes("/workspace")) return "+ Project";
    return "+ Create";
  };

  const renderModal = () => {

    if (!openModal) return null;

    if (location.pathname.includes("/workspaceswitcher")) {
      return (
        <CreateWorkspaceModal
          onClose={() => setOpenModal(false)}
          onCreate={(workspace) => {
            workspaces.push(workspace);
          }}
        />
      );
    }

    if (location.pathname.includes("/projects")) {
      return (
        <CreateColumnModal onClose={() => setOpenModal(false)} />
      );
    }

    if (location.pathname.includes("/workspace")) {
      return (
        <CreateProjectModal onClose={() => setOpenModal(false)} />
      );
    }

    return null;
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderBottom: "1px solid #e5e7eb",
          background: "white",
          color: "black"
        }}
      >

        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">
              LAP-TLJ
            </Typography>
          </Box>

          {/* CENTER */}
          <Box sx={{ width: 400 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search ..."
            />
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
            >
              {getCreateLabel()}
            </Button>

            <IconButton>
              <NotificationsIcon />
            </IconButton>

            <Avatar>
              LAP
            </Avatar>

          </Box>

        </Toolbar>

      </AppBar>

      {renderModal()}
    </>
  );
}

export default Topbar;