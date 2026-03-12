import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await login({ email, password }); // gọi API
        navigate("/home"); // chuyển trang
    } catch (error) {
        console.log(error);
    }
    };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        position: "relative"
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

      {/* Center Card */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card sx={{ width: 350, p: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Login
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/register")}
                    fullWidth
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#333"
                      }
                    }}
                  >
                    Register
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#333"
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>

                <Link
                  component="button"
                  underline="hover"
                  sx={{ textAlign: "left", fontSize: 14 }}
                >
                  Forgot password?
                </Link>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Login;