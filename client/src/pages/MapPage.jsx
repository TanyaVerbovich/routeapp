import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Map, GoogleApiWrapper} from "google-maps-react"

const MapPage = () => {
  const navigate = useNavigate();
  const { place11, place12, place21, place22 } = useParams();


  return (
    <div>
     {place11}
    </div>
  );
};

export default MapPage;
