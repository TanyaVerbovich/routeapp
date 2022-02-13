import React from "react";
import "./css/main.css";
import { useNavigate } from "react-router";
import { IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <IconButton
        className="iconButton"
        onClick={() => navigate("/login")}
        size="small"
        sx={{ color: "white" }}
      >
        <AccountCircle fontSize="large" />
      </IconButton>
    </nav>
  );
};

export default Header;
