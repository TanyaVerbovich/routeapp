import React, { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { saveAs } from "file-saver";
import axios from 'axios';
import fileDownload from 'js-file-download'

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


const ProjectCreationPage = () => {
  const { userId } = useParams();
  const [result, setResult] = useState(null);
  const [price, setPrice] = useState(null);
  const [driver, setDriver] = useState(null);
  const [order, setOrder] = useState(null);
  const [weight, setWeight] = useState(null);
  const [time_to, setTime_To] = useState(null);
  const [warning, setWarning] = useState(null);
  const [place11, setPlace11] = useState(null);
  const [place12, setPlace12] = useState(null);
  const [place21, setPlace21] = useState(null);
  const [place22, setPlace22] = useState(null);
  const [value, setValue] = React.useState("1");
  const [phone, setPhone] = React.useState("");
  const [time, setTime] = React.useState("");
  const [companyName, setCompanyName] = useState("");
  const [addressTo, setAddressTo] = React.useState("");
  const [addressFrom, setAddressFrom] = React.useState("");
  const [file, setFile] = React.useState();


  let navigate = useNavigate();

  const handleCreateButton = async (e) => {

    const formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('addres_from', addressFrom);
    formData.append('time', time);
    formData.append('address_to', addressTo);
    formData.append('file', file, file['name']);
    formData.append('phone', phone);
    formData.append('user_Id', userId);
    api.post(`/orders/${userId}`, formData).then((response) => {
      if (response.status === 204) {
        setWarning("Incorrect format of time or address Please, read rules.");
      }
      if (response.status === 201) {
        setPrice(response['data']['price'])
        setDriver(response['data']['driver'])
        setOrder(response['data']['order'])
        setWeight(response['data']['weight'])
        setTime_To(response['data']['time_to'])
        setPlace11(response['data']['place11'])
        setPlace12(response['data']['place12'])
        setPlace21(response['data']['place21'])
        setPlace22(response['data']['place22'])
        console.log(response['data']['place11'], " ", response['data']['place21'])
        setWarning("Price: " + response['data']['price'])
      }
      if (response.status === 202) {
        setWarning("No available drivers")
      }
      if (response.status === 203) {
        setWarning("No timetable for such time")
      }
    });
    // navigate(`/ord/${userId}`);
  };

  const handleConfirmButtom = async (e) => {

    const formData1 = new FormData();
    console.log(price, " ", driver, " ", order, " ", weight, " ", time_to)
    formData1.append('company_name', companyName);
    formData1.append('addres_from', addressFrom);
    formData1.append('time', time);
    formData1.append('address_to', addressTo);
    formData1.append('file', file, file['name']);
    formData1.append('phone', phone);
    formData1.append('user_Id', userId);
    formData1.append('price', price)
    formData1.append('driver', driver)
    formData1.append('order', order)
    formData1.append('weight', weight)
    formData1.append('time_to', time_to)
    formData1.append('place11', place11)
    formData1.append('place12', place12)
    formData1.append('place21', place21)
    formData1.append('place22', place22)
    api.post(`/sendorder/${userId}`, formData1).then((response) => {
      if (response.status === 201) {
        setWarning("Order is created")
      }
      // if (response.status === 201) {
      //   price = response['data']['price']
      //   setWarning("Price: " + response['data']['price'])
      // }
      if (response.status === 202) {
        setWarning("Try again")
      }
      // if (response.status === 203) {
      //   setWarning("No timetable for such time")
      // }
    });
    // navigate(`/ord/${userId}`);
  };

  const state = {
    selectedFile: null
  };

  const handleFile = (event) => {
    setResult("File is attached");
    setFile(event.target.files[0])
  }

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handlePhone = (event) => {
    setPhone(event.target.value);
  };

  const handleAddressToChange = (event) => {
    setAddressTo(event.target.value);
  };

  const handleName = (e) => {
    setCompanyName(e.target.value);
  };

  const handleAddressFromChange = (e) => {
    setAddressFrom(e.target.value);
  };

  const FileUpload = (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(formData, config).then((response) => {
      console.log(response.data);
    });

  }

  return (
    <div>
      <Container maxWidth="md">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
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
                    <Typography>Company name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
                      label='OOO "companyname"'
                      fullWidth={true}
                      size="small"
                      value={companyName}
                      onChange={(e) => handleName(e)}
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
                    <Typography>Address from:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="Minsk Programmistov 3"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={addressFrom}
                      onChange={(e) => handleAddressFromChange(e)}
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
                    <Typography>Time:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="13/02/2022 14:00"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={time}
                      onChange={(e) => handleTimeChange(e)}
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
                    <Typography>Address to:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="Minsk Programmistov 5"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={addressTo}
                      onChange={(e) => handleAddressToChange(e)}
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
                    <Typography>Contact phone:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="375291234567"
                      variant="outlined"
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
                    <Typography>File:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Button
                      style={{ backgroundColor: "#21b6ae" }}
                      variant="contained"
                      component="label"
                      onClick={() => FileUpload("")}
                    >
                      Upload File
                      <input
                        type="file"
                        name="file"
                        style={{ display: 'none' }}
                        onChange={handleFile}
                      />
                    </Button>
                    {result && <p style={{ color: "black", display: "contents" }}>{result}</p>}
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
                      onClick={() => navigate(`/homepage/customer/${userId}`)}
                      variant="outlined"
                    >
                      Cancel
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
                      disableElevation
                    >
                      Create
                    </Button>
                  </Grid> <Grid item>
                    <Button
                      sx={{
                        width: 85,
                        maxWidth: 120,
                        minWidth: 40,
                        m: 0.5,
                        textTransform: "none",
                        backgroundColor: "#21b6ae"
                      }}
                      onClick={() => handleConfirmButtom("")}
                      variant="contained"
                      disableElevation
                    >
                      Confirm
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

export default ProjectCreationPage;
