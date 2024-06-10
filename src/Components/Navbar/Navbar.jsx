import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const settings = ["Profile", "Dashboard", "Logout"];

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const [imageData, setImageData] = React.useState(null);
  const { isAuthenticated, logout } = useAuth();
  const fetchData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          accept: "application/json",
          token: accessToken, // Custom token header, matching your fetch request
        },
      });
      setImageData(res.data.result);
      localStorage.setItem("update", JSON.stringify(res.data.result));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    switch (setting) {
      case "Profile":
        navigate("/profile");
        break;
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Logout":
        logout();
        navigate("/");
        break;
      default:
        break;
    }
    handleCloseUserMenu();
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ background: "#16383B", color: "white", width: "100%" }}
    >
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          LOGO-HERE
        </Typography>

        <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}></Box>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          LOGO-HERE
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

        <Box sx={{ flexGrow: 0 }}>
          {isAuthenticated ? (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={imageData?.name}
                    src={imageData?.profile_image}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleMenuClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button variant="contained" onClick={() => navigate("/signup")}>
              SignUp
            </Button>
          )}
        </Box>
      </Toolbar>
    </Container>
  );
};
export default Navbar;
