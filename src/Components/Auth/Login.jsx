import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Modal, TextField } from "@mui/material";
import { AiOutlineLogin } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const OtpModal = ({ open, onClose, onSubmit }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const handleChange = (element, index) => {
      if (isNaN(element.value)) return false;

      setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

      // Focus next input
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      onSubmit(otp.join(""));
    };

    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Enter OTP</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px" }}
          >
            {otp.map((data, index) => (
              <TextField
                key={index}
                type="text"
                name="otp"
                inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                sx={{ width: "40px" }}
              />
            ))}
          </form>
          <Button variant="outlined" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit OTP
          </Button>
        </Box>
      </Modal>
    );
  };
  const checkEmail = async () => {
    try {
      const response = await axios.get(
        `https://stgapi-bnpl.tarality.io/api/v2/user/chackEmailExist?email=${email}`
      );

      if (response.data.responseResult) {
        setIsRegistered(true);
      } else {
        toast.error(response.data.responseMessage);
        navigate("/signup");
      }
    } catch (err) {
      setError("Error checking email");
      console.error(err);
    }
  };

  const handleLogin = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    axios
      .post(`https://stgapi-bnpl.tarality.io/api/v2/user/loginOtp`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.responseCode === 200) {
          toast.success(response.data.responseMessage);
          setOtpModal(true); // Show the OTP modal on successful login
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const handleOtpSubmit = async (otp) => {
    try {
      const response = await axios.put(
        `https://stgapi-bnpl.tarality.io/api/v2/user/verifyLoginOtp`,
        {
          email: email,
          otp: parseInt(otp, 10),
        }
      );
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        localStorage.setItem("accessToken",response.data.result.token)
        navigate("/dashboard");
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(error.response.data.responseMessage);
    }
    setOtpModal(false);
  };

  return (
    <>
      <Box
        textAlign={"center"}
        sx={{
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          width: "40%",
          m: "auto",
          mt: "5%",
          borderRadius: "20px",
          py: "1rem",
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
          sx={{ width: "80%" }}
        />
        <br />
        <Button
          variant="outlined"
          onClick={checkEmail}
          sx={{ mt: "5px", width: "30%" }}
        >
          check Email
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
              sx={{ width: "80%" }}
            />
            <br />

            <Button
              variant="outlined"
              onClick={handleLogin}
              sx={{ mt: "5px", width: "30%" }}
            >
              Login
            </Button>
          </>
        )}
        {error && <p>{error}</p>}
        <OtpModal
          open={otpModal}
          handleClose={() => setOtpModal(false)}
          email={email}
        />
      </Box>
      <OtpModal
        open={otpModal}
        onClose={() => setOtpModal(false)}
        onSubmit={handleOtpSubmit}
      />
    </>
  );
};

export default Login;
