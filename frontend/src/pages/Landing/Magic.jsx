import { Box } from "@mui/material";
import React from "react";
import LoginCard from "../../components/Login/LoginCard";
import axios from "../../config/axios";
import requests from "../../config/requests";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

// Add route protector to prevent reset
function Magic() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  function handelLogin(details) {
    const { password, confirm_password } = details;
    if (password !== confirm_password) {
      return enqueueSnackbar("Password does not match", { variant: "error" });
    }
    if (!regex.test(password)) {
      return enqueueSnackbar(
        "Password must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character",
        { variant: "error" }
      );
    }
    const updatePassword = async () => {
      const response = await axios.post(requests.createPassword, {
        token,
        password,
      });

      if (response.status >= 400) {
        enqueueSnackbar("Invalid/Expired token. Contact Admin for new link", {
          variant: "error",
        });
        navigate("/login");
      }
      if (response.status === 200) {
        enqueueSnackbar("Password set successfully", { variant: "success" });
        navigate("/login");
      }
    };
    updatePassword();
  }
  return (
    <>
      <Box
        id="home"
        component="section"
        className="container"
        justifyContent="center"
        alignItems="center"
        flexDirection={{
          xl: "row",
          lg: "row",
          md: "row",
          sm: "column",
          xs: "column",
        }}
      >
        <img
          src="/stats-bg-gradient.svg"
          alt=""
          style={{ position: "absolute", width: "60vw" }}
        />
        <LoginCard
          heading="Set Password"
          // subheading={userEmail}
          isRegister={true}
          isMagic
          alt="Login Here"
          onClick={handelLogin}
          route="/login"
        />
      </Box>
    </>
  );
}

export default Magic;
