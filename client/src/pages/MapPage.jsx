import React, { useState, useRef, useEffect } from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import osm from '../components/osm-providers';
import "leaflet/dist/leaflet.css";

const BasicMap = () => {

  
  const {  place11, place12, place21, place22 } = useParams();
  const [center, setCenter] = useState({lat: place11, lng: place12});
  const ZOOM_LEVEL = 12;
  const mapRef = useRef();
  const state = { markers: [] };

  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }, []);


  return (
    <div>
      <MapContainer
         center={center}
         zoom={ZOOM_LEVEL}
         ref={mapRef}
         style={{ height: "100vh" }}
      >
        <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution}/>
        <Marker position={[place11, place12]}>
      </Marker>
      <Marker position={[place21, place22]}>
      </Marker>
      </MapContainer>
    </div>
  );
};
export default BasicMap;
