import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import api from "../components/auth/api";
import { useNavigate, useParams } from "react-router";

const ChooseOption = ({ }) => {
 
  const navigate = useNavigate();
  const { userId } = useParams();

  function handleCreation() {
    navigate(`/orders/create/${userId}`);
  }

  function handleNormCreation() {
    navigate(`/orders/normalcreate/${userId}`);
  }  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems:"center", paddingTop: 200 }}>
      <Typography variant="h4"> How soon would you like to get your order?</Typography>
      <div style={{flexDirection: "row", paddingTop: 50}}>
        <Button type="submit"  onClick={handleCreation} style={{ backgroundColor: "#21b6ae", margin: 10 }} variant="contained"  >
          To сertain date
        </Button>
        <Button type="submit"  onClick={handleNormCreation} style={{ backgroundColor: "#21b6ae" }} variant="contained"  >
          Within the planned range of days
        </Button>
        </div>
    </div>
  );
};

export default ChooseOption;
