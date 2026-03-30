

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { createWorkspace } from "../../services/workspace.js";
import { parseToken } from  "../../Utils/parseToken.js"; 

import CreateWorkspaceModal from "../../modals/Creation/CreateWorkspaceModal";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";
import CreateProjectModal from "../../modals/Creation/CreateProjectModal";

function Topbar({ onWorkspaceCreated }) {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userInfo = parseToken(token);
    setUser(userInfo);
  }, []);

  const getCreateLabel = () => {
    if (location.pathname.includes("/workspaceswitcher")) return "+ Workspace";
    if (location.pathname.includes("/projects")) return "+ Column";
    if (location.pathname.includes("/workspace")) return "+ Project";
    return "+ Create";
  };

  const handleCreate = async (data) => {
    try {
      if (location.pathname.includes("/workspaceswitcher")) {
        const newWorkspace = await createWorkspace(data);
        if (onWorkspaceCreated) onWorkspaceCreated(newWorkspace);
      }
      setOpenModal(false);
    } catch (err) {
      console.error("Create error:", err);
      setOpenModal(false);
    }
  };

  const renderModal = () => {
    if (!openModal) return null;
    if (location.pathname.includes("/workspaceswitcher")) {
      return <CreateWorkspaceModal onClose={() => setOpenModal(false)} onCreate={handleCreate} />;
    }
    if (location.pathname.includes("/projects")) {
      return <CreateColumnModal onClose={() => setOpenModal(false)} onCreate={handleCreate} />;
    }
    if (location.pathname.includes("/workspace")) {
      return <CreateProjectModal onClose={() => setOpenModal(false)} onCreate={handleCreate} />;
    }
    return null;
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: "white", color: "black", borderBottom: "1px solid #e5e7eb" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {/* LEFT: Logo */}
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#4669fa" }}>
            LAP-TLJ
          </Typography>

          {/* CENTER: Search */}
          <Box sx={{ flex: 1, maxWidth: 500 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search..."
              sx={{
                borderRadius: "25px",
                backgroundColor: "#f1f3ff",
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiOutlinedInput-root": { borderRadius: "25px", bgcolor: "#f1f3ff" }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#777" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* RIGHT: Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#4669fa",
                "&:hover": { bgcolor: "#3651d4" },
                borderRadius: "20px"
              }}
            >
              {getCreateLabel()}
            </Button>

            <IconButton sx={{ bgcolor: "#f1f3ff", "&:hover": { bgcolor: "#e0e2f7" } }}>
              <NotificationsIcon />
            </IconButton>

            <Avatar sx={{ bgcolor: "#4669fa", fontWeight: 700 }}>
              {user ? user.username?.[0]?.toUpperCase() : "L"}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {renderModal()}
    </>
  );
}

export default Topbar;