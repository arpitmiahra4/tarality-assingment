import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Grid } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import OtpModal from "./OtpModal";
import { MdLockReset } from "react-icons/md";
import { BASE_URL } from "../../Constant/Api";

// Validation Schema using Yup
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleForget = async (values) => {
    try {
      const formData = new URLSearchParams();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);

      const response = await axios.put(`${BASE_URL}/resetPassword`, formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/")
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
            <MdLockReset fill="blue" /> Reset Password
          </h1>
          {/* <!-- Form Started --> */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForget}
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
                  Reset Password
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  );
};

export default ForgotPassword;
