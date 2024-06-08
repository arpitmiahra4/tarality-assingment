import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Modal } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { SiGnuprivacyguard } from "react-icons/si";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Validation Schema using Yup
const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

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
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
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

const Signup = () => {
  const [otpModal, setOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    try {
      const formData = new URLSearchParams();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      formData.append("userType", "user");

      const response = await axios.post(
        "https://stgapi-bnpl.tarality.io/api/v2/user/register",
        formData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setUserEmail(values.email);
        setOtpModal(true);
      }
    } catch (error) {
      toast.error(error.response.data.responseMessage);
      console.error(error);
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await axios.post(
        `https://stgapi-bnpl.tarality.io/api/v2/user/verifyOtp`,
        {
          email: userEmail,
          otp: parseInt(otp, 10),
        }
      );
      if (response.data.responseCode === 200) {
        toast.success("OTP Verified Successfully");
        navigate("/dashboard");
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(error.message);
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
          <SiGnuprivacyguard fill="blue" /> SignUp
        </h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  sx={{ width: "80%", mb: 1 }}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="password"
                  type="password"
                  label="Password"
                  variant="standard"
                  fullWidth
                  sx={{ width: "80%", mb: 1 }}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  variant="standard"
                  fullWidth
                  sx={{ width: "80%", mb: 1 }}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </div>
              <Button
                variant="outlined"
                type="submit"
                sx={{ mt: "15px", width: "40%" }}
              >
                SignUp
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      <OtpModal
        open={otpModal}
        onClose={() => setOtpModal(false)}
        onSubmit={handleOtpSubmit}
      />
    </>
  );
};

export default Signup;
