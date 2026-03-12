import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

function Register() {
  const [username, setUsername] = useState("");
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
      await register({ username, email, password });
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fff"
      }}
    >
        <Typography
            variant="h6"
            sx={{
                position: "absolute",
                top: 20,
                left: 40,
                fontWeight: "bold"
            }}
        >
            LAP-TLJ
        </Typography>
      <Card sx={{ width: 350, p: 2 }}>
        <CardContent>
          <Typography variant="h6">Sign up</Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} mt={2}>
              <TextField
                label="Name"
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              
              <TextField
                label="Email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                label="Confirm Password"
                type="password"
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "black" }}
              >
                Sign up
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/")}
              >
                Back to Login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;