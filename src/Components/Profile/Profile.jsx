import { Box, Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { BASE_URL } from "../../Constant/Api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          accept: "application/json",
          token: accessToken, // Custom token header, matching your fetch request
        },
      });
      setProfileData(res.data.result);
      localStorage.setItem("update", JSON.stringify(res.data.result));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            width: { xs: "90%", sm: "80%", md: "60%", lg: "80%" },
            m: "auto",
            borderRadius: "20px",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          }}
        >
          <h1
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CgProfile color="blue" /> Profile
          </h1>
          <Box sx={{ display: "flex", justifyContent: "end", width: "95%" }}>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/update");
              }}
            >
              Update Profile
            </Button>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <img
              alt={profileData.name}
              src={profileData.profile_image}
              style={{ width: "10%", height: "10%" }}
              loading="lazy"
            />
            <Typography mt={1}>Name - {profileData.name}</Typography>
            <Typography mt={1}>Email - {profileData.email}</Typography>
            <Typography mt={1}>
              Mobile Number - {profileData.country_code}
              {profileData.mobile_number}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Profile;
