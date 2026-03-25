import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

function Register() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password không khớp");
      return;
    }

    try {
      await register({ name, email, password });
      navigate("/workspaceswitcher");
    } catch (error) {
      console.log(error);
      alert("Register failed");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* LEFT FORM */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          px: { xs: 3, sm: 6, md: 10 },
          py: 4
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#4669fa",
            mb: { xs: 6, md: 12 }
          }}
        >
          LAP-TLJ
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#4669fa",
                mb: 2,
                fontSize: { xs: "2rem", md: "3rem" }
              }}
            >
              Create your account
            </Typography>

            <Typography sx={{ color: "#757575", mb: 6 }}>
              Sign up to get started 🚀
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Name */}
                <Box>
                  <Typography variant="caption" sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                    Name
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name"
                    InputProps={{ sx: { py: 1, color: "#4669fa" } }}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography variant="caption" sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                    Email Address
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    InputProps={{ sx: { py: 1, color: "#4669fa" } }}
                  />
                </Box>

                {/* Password */}
                <Box>
                  <Typography variant="caption" sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                    Password
                  </Typography>
                  <TextField
                    type="password"
                    variant="standard"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    InputProps={{ sx: { py: 1, color: "#4669fa" } }}
                  />
                </Box>

                {/* Confirm Password */}
                <Box>
                  <Typography variant="caption" sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                    Confirm Password
                  </Typography>
                  <TextField
                    type="password"
                    variant="standard"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    InputProps={{ sx: { py: 1, color: "#4669fa" } }}
                  />
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={3} sx={{ pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#4669fa",
                      px: 6,
                      py: 1.5,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#3552db' }
                    }}
                  >
                    Sign Up
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate("/")}
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#e0e0e0",
                      color: "#4669fa"
                    }}
                  >
                    Back
                  </Button>
                </Stack>

                {/* Login redirect */}
                <Typography variant="body2" sx={{ color: "#757575", pt: 2 }}>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    onClick={() => navigate("/")}
                    sx={{ color: "#4669fa", fontWeight: 600 }}
                  >
                    Login
                  </Link>
                </Typography>
              </Stack>
            </form>
          </Box>
        </Box>
      </Grid>

      {/* RIGHT IMAGE */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          bgcolor: "#f8f9fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          component="img"
          src="https://base.vn/wp-content/uploads/2024/05/Project-manager-1-1.webp"
          sx={{ width: "80%", maxWidth: 500 }}
        />
      </Grid>
    </Grid>
  );
}

export default Register;
