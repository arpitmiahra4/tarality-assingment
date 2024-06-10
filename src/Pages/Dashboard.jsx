import { Box, Typography } from "@mui/material";
import React from "react";

const Dashboard = () => {
  return (
    <Box sx={{ m: "auto" }}>
      <Typography sx={{ fontSize: "2rem" }}>
        Here's The Dashboard -{" "}
        <span style={{ color: "red" }}>A Protected Route</span>
      </Typography>
      <img
        src="https://static.vecteezy.com/system/resources/previews/009/380/043/non_2x/protection-shield-clipart-design-illustration-free-png.png"
        alt="error"
        loading="lazy"
        width={"40%"}
      />
    </Box>
  );
};

export default Dashboard;
