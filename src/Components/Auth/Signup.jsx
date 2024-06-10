import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Grid, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { SiGnuprivacyguard } from "react-icons/si";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import OtpModal from "./OtpModal";
import { BASE_URL } from "../../Constant/Api";

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

      const response = await axios.post(`${BASE_URL}/register`, formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setUserEmail(values.email);
        setOtpModal(true);
      }
    } catch (error) {
      if (error.response.data.responseCode === 405) {
        toast.error(error.response.data.responseMessage);
        navigate("/");
      }
      toast.error(error.response.data.responseMessage);
      console.error(error);
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await axios.post(`${BASE_URL}/verifyOtp`, {
        email: userEmail,
        otp: parseInt(otp, 10),
      });
      if (response.data.responseCode === 200) {
        toast.success("OTP Verified Successfully");
        navigate("/login");
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
      {/* <!-- Main container --> */}
      <Grid
        container
        justifyContent="center"
        sx={{ mt: { xs: 2, md: 5 }, p: { xs: 2, md: 3 } }}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            borderRadius: "20px",
            py: 3,
            px: 2,
            textAlign: "center",
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
          {/* <!-- Form Started --> */}
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
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  sx={{ width: "80%", mb: 2 }}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name="password"
                  type="password"
                  label="Password"
                  variant="standard"
                  fullWidth
                  sx={{ width: "80%", mb: 2 }}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  variant="standard"
                  fullWidth
                  sx={{ width: "80%", mb: 2 }}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                {/* <!-- button container --> */}
                <Button
                  variant="outlined"
                  type="submit"
                  sx={{ mt: 2, width: "40%" }}
                >
                  SignUp
                </Button>
              </Form>
            )}
          </Formik>
          <Typography mt={5}>
            Already Registered ??{" "}
            <span
              style={{ color: "#0044ff", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </Typography>
        </Grid>
      </Grid>
      {/* <!-- Modal container --> */}
      <OtpModal
        open={otpModal}
        onClose={() => setOtpModal(false)}
        email={userEmail}
        onSubmit={handleOtpSubmit}
      />
    </>
  );
};

export default Signup;
