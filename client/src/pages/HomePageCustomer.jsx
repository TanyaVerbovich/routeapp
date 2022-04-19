import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Grid,
  Typography,
  Container,
  Tab,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Breadcrumbs,
  Chip,
  Link as MuiLink,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import AppsIcon from "@mui/icons-material/Apps";
import api from "../components/auth/api";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const HomePageCustomer = () => {
  
  const { userId } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [currItems, setCurrItems] = useState([]);
  const [projectsTab, setProjectsTab] = useState("1");

  const handleProjectsTabIndexChange = (e, newValue) => {
    setProjectsTab(newValue);
  };

  const handleFilt = (e) => {
    setFilter(e.target.value);
  };

  function handleCreation() {
    navigate(`/orders/create/${userId}`);
  }

  const handleKeypress = e => {
    //it triggers by pressing the enter key
  if (e.key === "Enter") {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter: filter })
  };
  api.post(`/filtercustomer/${userId}`, requestOptions)
      .then(response => setCurrItems(response.data.filtered_customer))
      
  }
};

  useEffect(() => {
    async function fetchProjects() {
      let response = await api.get(`/ords/${userId}`);
      response = await response.data.orders;
      setCurrItems(response);
    }
    fetchProjects();
  }, [userId, navigate]);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg">
          <Container
            maxWidth="lg"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Grid
              item
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop="2em"
              marginBottom="1em"
            >
              <Typography variant="h5" sx={{ ml: 1 }}>
                Orders
              </Typography>
              <Button
                onClick={handleCreation}
                variant="contained"
                sx={{ width: "115px", textTransform: "none",  backgroundColor: "#21b6ae" }}
                disableElevation
              >
                New order
              </Button>
            </Grid>
          </Container>
          <Container maxWidth="lg">
            <TabContext value={projectsTab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TabList onChange={handleProjectsTabIndexChange}>
                  <Tab
                    label={
                      <span style={{ fontSize: 14, textTransform: "none" }}>
                        All
                      </span>
                    }
                    value="1"
                  />
                </TabList>

                <Grid item xs={4} sx={{ display: "inherit" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Filter by name"
                    sx={{ pl: 17 }}
                    fullWidth={true}
                    value={filter}
                    onKeyPress={handleKeypress}
                    onChange={(e) => handleFilt(e)}

                  />
                  </Grid>
              </Box>

              <TabPanel value="1">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <AppsIcon sx={{ ml: 1, mt: 1 }} />
                        </TableCell>
                        <TableCell align="left">Company name</TableCell>
                        <TableCell align="left">Address from&nbsp;</TableCell>
                        <TableCell align="left">Address to&nbsp;</TableCell>
                        <TableCell align="left">Time from&nbsp;</TableCell>
                        <TableCell align="left">Time to&nbsp;</TableCell>
                        <TableCell align="left">Phone</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Weight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currItems.map((item, index) => (
                        <TableRow
                          key={item.price}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            width="70"
                          >
                           
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.company_name}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.addres_from}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.address_to}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.time_from}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.time_to}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.phone}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.price}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.weight}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel value="2"></TabPanel>
            </TabContext>
          </Container>
        </Container>
      </Box>
    </div>
  );
};

export default HomePageCustomer;
