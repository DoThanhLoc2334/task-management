import { Outlet } from "react-router-dom";

import Topbar from "../components/navigation/Topbar";

import { Box } from "@mui/material";

function AppLayout() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Topbar */}
      <Topbar />


      <Box sx={{ flex: 1, display: "flex" }}>

       

        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>

      </Box>

    </Box>
  );
}

export default AppLayout;