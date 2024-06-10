import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [isAuthenticated, navigate]);

  return (
    <Box textAlign="center">
      <Typography sx={{ fontSize: "2rem" }}>
        {isAuthenticated
          ? `Redirecting to Dashboard in ${countdown} seconds`
          : `Redirecting to Login in ${countdown} seconds`}
      </Typography>
      <img
        src="https://cdn.dribbble.com/users/469578/screenshots/2597126/404-drib23.gif"
        alt="not found"
        width={"50%"}
      />
    </Box>
  );
};

export default NotFound;
