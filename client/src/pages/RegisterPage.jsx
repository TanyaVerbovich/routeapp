import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/auth/Register";

const RegisterPage = () => {
  const navigate = useNavigate();

  function handleRegister() {
    navigate("/login");
  }

  return (
    <div>
      <Container>
        <Register handleRegister={handleRegister} />
      </Container>
    </div>
  );
};

export default RegisterPage;
