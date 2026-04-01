import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  TextField
} from "@mui/material";

import { parseToken } from "../../Utils/parseToken.js";


function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userInfo = parseToken(token);
    setUser(userInfo);
  }, []);

  if (!user) {
    return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 5,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#4669fa",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {user.username?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: 700, mb: 3 }}
        >
          User Profile
        </Typography>

        {/* Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            value={user.username || ""}
            fullWidth
            disabled
          />

          <TextField
            label="Email"
            value={user.email || ""}
            fullWidth
            disabled
          />
        </Box>

        {/* Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            bgcolor: "#4669fa",
            "&:hover": { bgcolor: "#3651d4" },
            borderRadius: "20px",
            textTransform: "none",
          }}
        >
          Edit Profile
        </Button>
      </Paper>
    </Box>
  );
}

export default UserProfile;