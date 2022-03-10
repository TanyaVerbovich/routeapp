import React from "react";
import "./css/main.css";
import { useNavigate } from "react-router";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
     <Link to="/rules" style={{ paddingRight: 25, textDecoration: 'none', color: "white"}} >Rules</Link>
      <IconButton
        className="iconButton"
        onClick={() => navigate("/")}
        size="small"
        sx={{ color: "white" }}
      >
        <AccountCircle fontSize="large" />
      </IconButton>
    </nav>
  );
};

export default Header;
