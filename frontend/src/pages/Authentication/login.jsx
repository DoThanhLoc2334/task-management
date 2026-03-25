import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Checkbox,
  FormControlLabel,
  Grid,
  Container
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
      const res = await login({ email, password });
      
      const response = res.data;

      if (response.success) {
        // Lưu accessToken vào localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Điều hướng
        navigate("/workspaceswitcher");
      } else {
        // Hiển thị lỗi nếu login thất bại
        alert(response.message);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Server error, please try again.");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* CỘT BÊN TRÁI: FORM SECTION */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          px: { xs: 3, sm: 6, md: 10 },
          py: 4
        }}
      >
        {/* Brand Logo */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800, 
            color: "#4669fa", 
            letterSpacing: "-0.5px",
            mb: { xs: 6, md: 12 } 
          }}
        >
          Login In Task Management
        </Typography>

        {/* Form Container - Căn giữa theo chiều dọc */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: "#4669fa", 
                mb: 2, 
                lineHeight: 1.1,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              TASK MANAGEMENT
            </Typography>
            
            <Typography variant="body1" sx={{ color: "#757575", mb: 6, fontSize: '1.1rem' }}>
              Welcome back! Please login to your account.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Email Field */}
                <Box>
                  <Typography variant="caption" sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                    Email Address
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="USER@GMAIL.com"
                    InputProps={{ 
                      disableUnderline: false,
                      sx: { py: 1, fontSize: '1rem', color: '#4669fa' } 
                    }}
                    sx={{
                      '& .MuiInput-underline:before': { borderBottomColor: '#e0e0e0' },
                      '& .MuiInput-underline:after': { borderBottomColor: '#4669fa' },
                    }}
                  />
                </Box>

                {/* Password Field */}
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
                    placeholder="************"
                    InputProps={{ 
                      sx: { py: 1, fontSize: '1rem', color: '#4669fa' } 
                    }}
                    sx={{
                      '& .MuiInput-underline:before': { borderBottomColor: '#e0e0e0' },
                    }}
                  />
                </Box>

                {/* Options row */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel 
                    control={<Checkbox size="small" sx={{ color: '#e0e0e0', '&.Mui-checked': { color: '#4669fa' } }} />} 
                    label={<Typography variant="body2" sx={{ color: '#757575' }}>Remember Me</Typography>} 
                  />
                  <Link href="#" underline="none" sx={{ fontSize: 14, color: "#757575", fontWeight: 500 }}>
                    Forgot Password?
                  </Link>
                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={3} sx={{ pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    sx={{ 
                      bgcolor: "#4669fa", 
                      px: 6, py: 1.5, 
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#3552db' }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/register")}
                    sx={{ 
                      px: 6, py: 1.5, 
                      borderRadius: '8px', 
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: "#e0e0e0",
                      color: "#4669fa",
                      '&:hover': { borderColor: '#4669fa', bgcolor: 'transparent' }
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>

                {/* Social Login */}
                <Box sx={{ pt: 4 }}>
                  <Typography variant="body2" sx={{ color: "#9e9e9e", mb: 2 }}>
                    Or login with
                  </Typography>
                  <Stack direction="row" spacing={4}>
                    {['Facebook', 'LinkedIn', 'Google'].map((platform) => (
                      <Link 
                        key={platform}
                        href="#" 
                        underline="none" 
                        sx={{ fontWeight: 700, color: "#4669fa", fontSize: '0.9rem' }}
                      >
                        {platform}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </form>
          </Box>
        </Box>
      </Grid>

      {/* CỘT BÊN PHẢI: ILLUSTRATION SECTION */}
      <Grid 
        item 
        xs={false} 
        md={6} 
        sx={{ 
          bgcolor: "#f8f9fd", // Màu xám nhạt hơi xanh cho hiện đại
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Top Navigation */}
        {/* <Stack 
          direction="row" 
          spacing={5} 
          sx={{ position: "absolute", top: 48 }}
        >
          <Link href="#" underline="none" sx={{ color: "#212121", fontWeight: 700, borderBottom: "3px solid #4669fa", pb: 0.5 }}>Home</Link>
          {['About us', 'Blog', 'Pricing'].map((item) => (
            <Link key={item} href="#" underline="none" sx={{ color: "#9e9e9e", fontWeight: 600, '&:hover': { color: '#212121' } }}>
              {item}
            </Link>
          ))}
        </Stack> */}

        {/* Central Illustration */}
        <Box 
          component="img"
          src="https://arito.vn/wp-content/uploads/2024/07/Screenshot-2024-07-21-at-15.39.51-1.png" 
          alt="Illustration"
          sx={{ 
            width: "85%", 
            maxWidth: 550,
            filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.05))" 
          }}
        />
      </Grid>
    </Grid>
  );
}

export default Login;