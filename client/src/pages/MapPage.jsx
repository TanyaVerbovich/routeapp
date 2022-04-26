import React, { useState, useRef, useEffect } from "react";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import osm from '../components/osm-providers';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

export default function App() {
  
  const {  place11, place12, place21, place22 } = useParams();
  const position = [place11, place12];
  

  function Routing() {
    const map = useMap();
  
    useEffect(() => {
      if (!map) return;
  
      const routingControl = L.Routing.control({
        waypoints: [L.latLng(place11, place12), L.latLng(place21, place22)],
        routeWhileDragging: true
      }).addTo(map);
  
      return () => map.removeControl(routingControl);
    }, [map]);
  
    return null;
  }

  useEffect(() => {

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

     }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh" }}>
      <TileLayer
       url={osm.maptiler.url} attribution={osm.maptiler.attribution}
      />
      <Routing />
    </MapContainer>
  );
}
