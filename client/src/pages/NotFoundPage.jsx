import { Typography } from "@mui/material";
import React from "react";

const NotFoundPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems:"center" }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h4">Page not found</Typography>
    </div>
  );
};

export default NotFoundPage;
