import React, { useState, useRef, useEffect } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { MdVerified } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const OtpModal = ({ open, onClose, onSubmit, email }) => {
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (open) {
      setCountdown(60);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [open]);

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d+$/, "OTP must only contain numbers")
      .required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values.otp);
    },
  });

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value) || value.length > 1) return;

    const otpArray = formik.values.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");

    formik.setFieldValue("otp", newOtp);

    // Move to the next input if the current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formik.values.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleResendSubmit = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/resendOtp`, {
        email: email,
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(error.response.data.responseMessage);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* <!-- Modal container --> */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "60%", lg: "40%", xl: "30%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "20px",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Verify OTP <MdVerified fill="green" />
        </Typography>
        {/* <!-- Form Started --> */}
        <form
          onSubmit={formik.handleSubmit}
          style={{ display: "flex", gap: "10px", marginTop: "1rem" }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              style={{
                width: "40px",
                textAlign: "center",
                fontSize: "1.2rem",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              value={formik.values.otp[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </form>
        {/* <!-- button container --> */}
        <Button
          variant="outlined"
          onClick={formik.handleSubmit}
          disabled={formik.values.otp.length < 6}
          sx={{ mt: 2 }}
        >
          Submit OTP
        </Button>
        {formik.errors.otp && (
          <Typography color="error" fontSize=".8rem" mt="2%">
            {formik.errors.otp}
          </Typography>
        )}
        {countdown > 0 ? (
          <Typography fontSize={".8rem"} mt={"2%"}>
            Haven't Received? Resend OTP in {countdown} seconds
          </Typography>
        ) : (
          <Typography fontSize={".8rem"} mt={"2%"}>
            Haven't Received?
            <span
              style={{ color: "#0044ff", cursor: "pointer" }}
              onClick={handleResendSubmit}
            >
              Resend OTP
            </span>
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default OtpModal;
