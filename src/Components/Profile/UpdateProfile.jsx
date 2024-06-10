import { Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

// Validation Schema using Yup
const UpdateProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  country_code: Yup.string().required("Country code is required"),
  mobile_number: Yup.string()
    .matches(/^[0-9]+$/, "Mobile number must be digits only")
    .required("Mobile number is required"),
  user_name: Yup.string().required("Username is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  profile_image: Yup.string()
    .url("Invalid URL")
    .required("Profile image URL is required"),
  display_name: Yup.string().required("Display name is required"),
  county: Yup.string().required("County is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^[0-9]+$/, "Pincode must be digits only")
    .required("Pincode is required"),
  address: Yup.string().required("Address is required"),
});

const UpdateProfile = () => {
  const profileData = JSON.parse(localStorage.getItem("update") || "{}");
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    country_code: "",
    mobile_number: "",
    user_name: "",
    first_name: "",
    last_name: "",
    profile_image: "",
    display_name: "",
    county: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
  });
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    setInitialValues({
      name: profileData.name || "",
      email: profileData.email || "",
      country_code: profileData.country_code || "",
      mobile_number: profileData.mobile_number || "",
      user_name: profileData.user_name || "",
      first_name: profileData.first_name || "",
      last_name: profileData.last_name || "",
      profile_image: profileData.profile_image || "",
      display_name: profileData.display_name || "",
      county: profileData.county || "",
      state: profileData.state || "",
      city: profileData.city || "",
      pincode: profileData.pincode || "",
      address: profileData.address || "",
    });
  }, [profileData]);

  const handleProfileUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("country_code", values.country_code);
      formData.append("mobile_number", values.mobile_number);
      formData.append("user_name", values.user_name);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("profile_image", values.profile_image);
      formData.append("display_name", values.display_name);
      formData.append("county", values.county);
      formData.append("state", values.state);
      formData.append("city", values.city);
      formData.append("pincode", values.pincode);
      formData.append("address", values.address);

      const response = await axios.put(`${BASE_URL}/updateProfile`, formData, {
        headers: {
          accept: "application/json",
          token: accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/profile");
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
      {/* Main container */}
      <Grid
        container
        justifyContent="center"
        sx={{ mt: { xs: 2, md: 5 }, p: { xs: 2, md: 3 } }}
      >
        <Grid
          item
          xs={12}
          md={8}
          lg={6}
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
            <CgProfile color="blue" /> Update Profile
          </h1>
          {/* Form Started */}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={UpdateProfileSchema}
            onSubmit={handleProfileUpdate}
          >
            {({ errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Name"
                      variant="standard"
                      fullWidth
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="email"
                      type="email"
                      label="Email"
                      variant="standard"
                      fullWidth
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="country_code"
                      label="Country Code"
                      variant="standard"
                      fullWidth
                      error={touched.country_code && !!errors.country_code}
                      helperText={touched.country_code && errors.country_code}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="mobile_number"
                      label="Mobile Number"
                      variant="standard"
                      fullWidth
                      error={touched.mobile_number && !!errors.mobile_number}
                      helperText={touched.mobile_number && errors.mobile_number}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="user_name"
                      label="Username"
                      variant="standard"
                      fullWidth
                      error={touched.user_name && !!errors.user_name}
                      helperText={touched.user_name && errors.user_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="first_name"
                      label="First Name"
                      variant="standard"
                      fullWidth
                      error={touched.first_name && !!errors.first_name}
                      helperText={touched.first_name && errors.first_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="last_name"
                      label="Last Name"
                      variant="standard"
                      fullWidth
                      error={touched.last_name && !!errors.last_name}
                      helperText={touched.last_name && errors.last_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="profile_image"
                      label="Profile Image URL"
                      variant="standard"
                      fullWidth
                      error={touched.profile_image && !!errors.profile_image}
                      helperText={touched.profile_image && errors.profile_image}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="display_name"
                      label="Display Name"
                      variant="standard"
                      fullWidth
                      error={touched.display_name && !!errors.display_name}
                      helperText={touched.display_name && errors.display_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="county"
                      label="County"
                      variant="standard"
                      fullWidth
                      error={touched.county && !!errors.county}
                      helperText={touched.county && errors.county}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="state"
                      label="State"
                      variant="standard"
                      fullWidth
                      error={touched.state && !!errors.state}
                      helperText={touched.state && errors.state}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="city"
                      label="City"
                      variant="standard"
                      fullWidth
                      error={touched.city && !!errors.city}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="pincode"
                      label="Pincode"
                      variant="standard"
                      fullWidth
                      error={touched.pincode && !!errors.pincode}
                      helperText={touched.pincode && errors.pincode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      variant="standard"
                      fullWidth
                      multiline
                      error={touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                </Grid>
                {/* button container */}
                <Button
                  variant="outlined"
                  type="submit"
                  sx={{ mt: 2, width: "40%" }}
                >
                  Update Profile
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateProfile;
