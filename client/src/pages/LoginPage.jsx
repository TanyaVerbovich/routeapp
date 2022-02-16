import { Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Container>
        <Login />
      </Container>
    </div>
  );
};

export default LoginPage;
