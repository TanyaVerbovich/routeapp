import React, { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from 'axios';

import {
  Container,
  FormControl,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  Button,
  Tab,
  Box,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Autocomplete,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import api from "../components/auth/api";


const CreateDriver = () => {
  const { user_id, userId } = useParams();
  const [userName, setUsername] = useState(null);
  const [warning, setWarning] = useState(null);
  const [value, setValue] = React.useState("1");
  const [phone, setPhone] = React.useState("");
  const [car, setCar] = React.useState("");
  const [fuelConsumption, setFuelConsumption] = React.useState("");
  const navigate = useNavigate();


  const handleCreateButton = (e, reason) => {
    const sep_users = {
      userName: userName,
      phone: phone,
      car: car,
      fuelConsumption: fuelConsumption
    };
    async function sendRequest() {
      await api
        .post(`/add_driver/${user_id}`, sep_users)
        .then((resp) => {
          if (resp.status == 201){
            setWarning("added successfully")
          }
          if (resp.status == 203){
              setWarning("such driver already exists")
          }
        });

    }
    sendRequest();
  };


  function getUserName() {
    api.post(`/timetable/username/${user_id}`).then((response) => {
      setUsername(response.data['username'])
    });
  };

  const handlePhone = (event) => {
    setPhone(event.target.value);
  };

  const handleCar = (event) => {
    setCar(event.target.value);
  };

  const handleFuelConsumption = (event) => {
    setFuelConsumption(event.target.value);
  };

  return (
    <div>
      <Container maxWidth="md">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            {getUserName()}
            {userName && <Typography variant="h4" sx={{ ml: 3, textAlignLast: "left", mt: 3 }}>Driver: {userName}</Typography>}
            <TabPanel value="1">
              <FormControl fullWidth>
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Grid item>
                    <Typography>Phone:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
                      label='375291234567'
                      fullWidth={true}
                      size="small"
                      value={phone}
                      onChange={(e) => handlePhone(e)}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Grid item>
                    <Typography>Car:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="Audi 100"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={car}
                      onChange={(e) => handleCar(e)}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Grid item>
                    <Typography>Fuel consumption:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="8"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={fuelConsumption}
                      onChange={(e) => handleFuelConsumption(e)}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  sx={{ p: 3, pr: 0, pb: 0 }}
                >
                  <Grid item>
                  </Grid>
                  {warning && <p style={{ color: "red" }}>{warning}</p>}
                  <Grid item>
                    <Button
                      sx={{ m: 0.5, textTransform: "none", backgroundColor: "#21b6ae", color: "#fff" }}
                      onClick={() => navigate(`/homepage/admin/${userId}`)}
                      variant="outlined"
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{
                        width: 85,
                        maxWidth: 120,
                        minWidth: 40,
                        m: 0.5,
                        textTransform: "none",
                        backgroundColor: "#21b6ae"
                      }}
                      onClick={() => handleCreateButton("")}
                      variant="contained"
                      // disableElevation
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </FormControl>
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </div>
  );
};

export default CreateDriver;
