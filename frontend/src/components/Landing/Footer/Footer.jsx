import React from "react";
import { Box, Typography } from "@mui/material";
function Footer() {
  return (
    <Box
      component={"footer"}
      sx={{
        width: "100%",
        height: "10vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "primary.main",
      }}
    >
      <Typography
        variant="body2"
        color="white"
        fontWeight={"600"}
        fontSize={"1.2rem"}
        align="center"
      >
        Made with ❤️ by Team Obviously
      </Typography>
    </Box>
  );
}

export default Footer;
