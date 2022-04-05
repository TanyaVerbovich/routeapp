import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";


import GoogleMap from '../components/GoogleMap';

function MapPage() {
  return (
    <div className="App">
      <GoogleMap />
    </div>
  );
}

export default MapPage;

