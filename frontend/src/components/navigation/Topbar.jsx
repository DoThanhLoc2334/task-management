import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { createWorkspace } from "../../services/workspace.js";
import { parseToken } from "../../Utils/parseToken.js";

import CreateWorkspaceModal from "../../modals/Creation/CreateWorkspaceModal";
import CreateColumnModal from "../../modals/Creation/CreateColumnModal";
import CreateProjectModal from "../../modals/Creation/CreateProjectModal";

function Topbar({ onWorkspaceCreated }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null);

  // menu avatar
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

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

  // ===== Avatar menu =====
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    handleCloseMenu();
    navigate("/");
  };


  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "white",
          color: "black",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {/* LEFT */}
          <Box
            onClick={() => navigate("/workspaceswitcher")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <Typography fontWeight={700} color="#4669fa">
              LAP-TLJ
            </Typography>
          </Box>

          {/* CENTER */}
          <Box sx={{ flex: 1, maxWidth: 500 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search..."
              sx={{
                borderRadius: "25px",
                backgroundColor: "#f1f3ff",
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  bgcolor: "#f1f3ff",
                },
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

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#4669fa",
                "&:hover": { bgcolor: "#3651d4" },
                borderRadius: "20px",
              }}
            >
              {getCreateLabel()}
            </Button>

            <IconButton sx={{ bgcolor: "#f1f3ff", "&:hover": { bgcolor: "#e0e2f7" } }}>
              <NotificationsIcon />
            </IconButton>

            {/* AVATAR */}
            <Avatar
              sx={{
                bgcolor: "#4669fa",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={handleAvatarClick}
            >
              {user ? user.username?.[0]?.toUpperCase() : "L"}
            </Avatar>

            {/* DROPDOWN MENU */}
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 230,
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  p: 1,
                },
              }}
            >
              {/* User info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1 }}>
                <Avatar sx={{ bgcolor: "#4669fa" }}>
                  {user ? user.username?.[0]?.toUpperCase() : "L"}
                </Avatar>
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {user?.username || "User"}
                  </Typography>
                  <Typography fontSize={12} color="gray">
                    {user?.email || "No email"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={() => navigate("/profile")}>
                Profile
              </MenuItem>

              <MenuItem onClick={() => navigate("/settings")}>
                Settings
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{ color: "red", fontWeight: 500 }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {renderModal()}
    </>
  );
}

export default Topbar;