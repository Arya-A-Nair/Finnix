import { Box, CircularProgress } from "@mui/material";
import React from "react";

function LoadingScreen() {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
    >
      <CircularProgress />
    </Box>
  );
}

export default LoadingScreen;
