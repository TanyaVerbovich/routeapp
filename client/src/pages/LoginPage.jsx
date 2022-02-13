import { Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div>
      <Container>
        <Login handleLogin={handleLogin} />
      </Container>
    </div>
  );
};

export default LoginPage;
