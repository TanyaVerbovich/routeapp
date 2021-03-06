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


const EditTimetable = () => {
  const { userId, driver_id } = useParams();
  const [userName, setUsername] = useState(null);
  const [warning, setWarning] = useState(null);
  const [value, setValue] = React.useState("1");
  const [timeBegin, setTimeBegin] = React.useState("");
  const [timeEnd, setTimeEnd] = React.useState("");
  const [weekdays, setWeekdays] = React.useState("");
  const navigate = useNavigate();


  const handleCreateButton = (e, reason) => {
    const sep_users = {
      timeBegin: timeBegin,
      timeEnd: timeEnd,
      weekdays: weekdays
    };
    async function sendRequest() {
      await api
        .post(`/edit_timetable/${userId}/${driver_id}`, sep_users)
        .then((resp) => {
          if (resp.status == 201){
            setWarning("edited successfully")
            navigate(`/homepage/admin/${userId}`)
          }
        });

    }
    sendRequest();
  };


  function getUserName() {
    api.post(`/timetable/username/${driver_id}`).then((response) => {
      setUsername(response.data['username'])
    });
  };

  const handleTimeBegin = (event) => {
    setTimeBegin(event.target.value);
  };

  const handleTimeEnd = (event) => {
    setTimeEnd(event.target.value);
  };

  const handleWeekdays = (event) => {
    setWeekdays(event.target.value);
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
                    <Typography>Time Begin:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
                      label='9:00'
                      fullWidth={true}
                      size="small"
                      value={timeBegin}
                      onChange={(e) => handleTimeBegin(e)}
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
                    <Typography>Time End:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="18:00"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={timeEnd}
                      onChange={(e) => handleTimeEnd(e)}
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
                    <Typography>Weekdays:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="Saturday, Sunday"
                      variant="outlined"
                      fullWidth={true}
                      size="small"
                      value={weekdays}
                      onChange={(e) => handleWeekdays(e)}
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
                      Edit
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

export default EditTimetable;
