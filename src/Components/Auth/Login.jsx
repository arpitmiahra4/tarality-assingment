import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Grid, Typography } from "@mui/material";
import { AiOutlineLogin } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import OtpModal from "./OtpModal";
import { BASE_URL } from "../../Constant/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const checkEmail = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/chackEmailExist?email=${email}`
      );

      if (response.data.responseResult) {
        setIsRegistered(true);
      } else {
        toast.error(response.data.responseMessage);
        navigate("/signup");
      }
    } catch (err) {
      toast.error("Error checking email");
      console.error(err);
    }
  };

  const handleLogin = () => {
    const payload = {
      email: email,
      password: password,
    };

    axios
      .post(`${BASE_URL}/loginOtp`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        if (response.data.responseCode === 200) {
          toast.success(response.data.responseMessage);
          setOtpModal(true);
        } else {
          toast.error(response.data.responseMessage);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.responseMessage);
      });
  };

  const handleOtpSubmit = async (otp) => {
    const endpoint = forgotPasswordModal
      ? `${BASE_URL}/verifyOtp`
      : `${BASE_URL}/verifyLoginOtp`;

    const method = forgotPasswordModal ? "post" : "put";

    try {
      const response = await axios({
        method: method,
        url: endpoint,
        data: {
          email: email,
          otp: parseInt(otp, 10),
        },
      });
      // Check if the response code is 200 (success)
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);

        if (forgotPasswordModal) {
          navigate("/resetPassword");
        } else {
          localStorage.setItem("accessToken", response.data.result.token);
          login();
          navigate("/dashboard");
        }
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(error.response.data.responseMessage);
    }
    setOtpModal(false);
  };

  const handleForgot = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/forgotPassword`, {
        email: email,
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setOtpModal(true);
        setForgotPasswordModal(true); // Set state to indicate forgot password modal opened
      } else if (response.data.responseCode === 402) {
        toast.error(response.data.responseMessage);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(error.response.data.responseMessage);
    }
  };

  return (
    <>
      {/* <!-- Main container --> */}
      <Grid container justifyContent="center" alignItems="center" sx={{ p: 2 }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box
            textAlign={"center"}
            sx={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
              width: { xs: "90%", sm: "80%", md: "60%", lg: "100%" },
              borderRadius: "20px",
              p: { xs: 2, sm: 3 },
              m: "auto",
              bgcolor: "background.paper",
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
              <AiOutlineLogin fill="blue" /> Login
            </h1>
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: "80%", mb: 2 }}
            />
            <br />
            {/* <!-- button container --> */}
            <Button
              variant="outlined"
              onClick={checkEmail}
              sx={{ mt: 2, width: { xs: "80%", sm: "30%" } }}
            >
              Check Email
            </Button>
            <br />
            {isRegistered && (
              <>
                <TextField
                  id="standard-basic"
                  label="Password"
                  variant="standard"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ width: "80%", mt: 2 }}
                />
                <br />
                {/* <!-- button container --> */}
                <Button
                  variant="outlined"
                  onClick={handleLogin}
                  sx={{ mt: 2, width: { xs: "80%", sm: "30%" } }}
                >
                  Login
                </Button>
                <Typography
                  mt={5}
                  sx={{ color: "#0044ff", cursor: "pointer" }}
                  onClick={handleForgot}
                >
                  Forgot Password?
                </Typography>
              </>
            )}
            {/* <!-- Modal container --> */}
            <OtpModal
              open={otpModal}
              handleClose={() => setOtpModal(false)}
              email={email}
              onSubmit={handleOtpSubmit}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
