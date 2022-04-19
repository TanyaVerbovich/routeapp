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
  Chip,
  Link as MuiLink,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import AppsIcon from "@mui/icons-material/Apps";
import api from "../components/auth/api";

const HomePageAdmin = () => {
  const usr = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-16.png";
  const navigate = useNavigate();
  const { userId, driver_id } = useParams();
  const [username, setUsername] = useState(null);
  const [monday, setMonday] = useState(null);
  const [sunday, setSunday] = useState(null);
  const [currTimetable, setCurrTimetable] = useState([]);
  const [currItems, setCurrItems] = useState([]);
  const [currOrders, setCurrOrders] = useState([]);
  const [currDrivers, setCurrDrivers] = useState([]);
  const [currMany, setCurrMany] = useState([]);
  const [projectsTab, setProjectsTab] = useState("1");

  const handleProjectsTabIndexChange = (e, newValue) => {
    setProjectsTab(newValue);
  };

  function handleEditItem(driver_id) {
    navigate(`/edit/timetable/${userId}/${driver_id}`);
  }

  function handleDeleteItem(driver_phone) {
    api.post(`/delete/driver/${driver_phone}`).then((resp) => console.log(resp.data))
  }

  function handleAddDriver(driver_id) {
    navigate(`/create/driver/${userId}/${driver_id}`);
  }

  function getUserName() {
    api.post(`/username/${userId}`).then((response) => {
      setUsername(response.data['username'])
    });
  };


  function getDays() {
    api.post(`/getDays`).then((response) => {
      setMonday(response.data['monday'])
      setSunday(response.data['sunday'])
    });
  };


  useEffect(() => {
    async function fetchProjects() {
      let response = await api.get(`/users`);
      response = await response.data.users;
      setCurrItems(response);
      console.log(response);
    }
    fetchProjects();
  }, [navigate]);


  useEffect(() => {
    async function fetchProjects() {
      let response = await api.get(`/timetable`);
      response = await response.data.timetable;
      setCurrTimetable(response);
      console.log(response);
    }
    fetchProjects();
  }, [navigate]);

  useEffect(() => {
    async function fetchProjects() {
      let response = await api.get(`/allorders`);
      response = await response.data.orders;
      setCurrOrders(response);
      console.log(response);
    }
    fetchProjects();
  }, [navigate]);



  useEffect(() => {
    async function fetchProjects() {
      let response = await api.get(`/many`);
      response = await response.data.ord_driver;
      setCurrMany(response);
      console.log(response);
    }
    fetchProjects();
  }, [navigate]);


  useEffect(() => {
    async function fetchProjects() {
      let response = await api.get(`/drivers`);
      response = await response.data.drivers;
      setCurrDrivers(response);
      console.log(response);
    }
    fetchProjects();
  }, [navigate]);

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
              {getUserName()}
              {username && <Typography variant="h4" sx={{ ml: 1 }}>Hi, {username}!</Typography>}
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
                        Users
                      </span>
                    }
                    value="1"
                  />
                  <Tab
                    label={
                      <span style={{ fontSize: 14, textTransform: "none" }}>
                        Orders
                      </span>
                    }
                    value="2"
                  />
                  <Tab
                    label={
                      <span style={{ fontSize: 14, textTransform: "none" }}>
                        Drivers
                      </span>
                    }
                    value="3"
                  />
                  <Tab
                    label={
                      <span style={{ fontSize: 14, textTransform: "none" }}>
                        Drivers working hours
                      </span>
                    }
                    value="4"
                  />
                   <Tab
                    label={
                      <span style={{ fontSize: 14, textTransform: "none" }}>
                        Drivers-Orders
                      </span>
                    }
                    value="5"
                  />
                </TabList>

                {/* <Grid item xs={4} sx={{ display: "inherit" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Filter by name"
                    sx={{ pl: 17 }}
                  />
                </Grid> */}
              </Box>

              <TabPanel value="1">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <AppsIcon sx={{ ml: 1, mt: 1 }} />
                        </TableCell>
                        <TableCell align="left">Username 
                        {/* <img className="arrow" 
                        onClick={sortDesc}          
                        src={usr} /> */}
                        </TableCell>
                        <TableCell align="left">Mail&nbsp;</TableCell>
                        <TableCell align="left">Role&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currItems.map((item, index) => (
                        <TableRow
                          key={item.userName}
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
                                {item.userName}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {item.mail}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <Chip
                              label={item.role}
                              variant="filled"
                            />
                          </TableCell>
                          {item.role == 'driver' ?
                            <Button
                              style={{
                                borderRadius: 35,
                                backgroundColor: "#21b6ae",
                                padding: "9px 18px",
                                fontSize: "12px"
                              }}
                              variant="contained"
                             onClick={() => handleAddDriver(item.id)}
                            >
                              Add
                            </Button> : null
                          }
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>


              <TabPanel value="2">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <AppsIcon sx={{ ml: 1, mt: 1 }} />
                        </TableCell>
                        <TableCell align="left">Company name</TableCell>
                        <TableCell align="left">Adsress from&nbsp;</TableCell>
                        <TableCell align="left">Address to&nbsp;</TableCell>
                        <TableCell align="left">Time from&nbsp;</TableCell>
                        <TableCell align="left">Time to&nbsp;</TableCell>
                        <TableCell align="left">Phone&nbsp;</TableCell>
                        <TableCell align="left">Price&nbsp;</TableCell>
                        <TableCell align="left">Weight&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currOrders.map((ord, index) => (
                        <TableRow
                          key={ord.company_name}
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
                                {ord.company_name}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.addres_from}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.address_to}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.time_from}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.time_to}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.phone}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.price}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {ord.weight}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>


              <TabPanel value="3">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <AppsIcon sx={{ ml: 1, mt: 1 }} />
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Phone&nbsp;</TableCell>
                        <TableCell align="left">Car&nbsp;</TableCell>
                        <TableCell align="left">Fuel consumption(liter/100km)&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currDrivers.map((driv, index) => (
                        <TableRow
                          key={driv.userName}
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
                                {driv.userName}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {driv.phone}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {driv.car}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {driv.fuelConsumption}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <Button
                            style={{
                              borderRadius: 35,
                              backgroundColor: "#21b6ae",
                              padding: "9px 18px",
                              fontSize: "12px"
                            }}
                            variant="contained"
                            onClick={() => handleDeleteItem(driv.phone)}
                          >
                            Delele
                          </Button>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value="4">
                <TableContainer>
                  <Table>
                    <TableHead>
                      {getDays()}
                      {monday && sunday && <Typography variant="h9" sx={{ ml: 0, fontWeight: "bold" }}>{monday}-{sunday}</Typography>}
                      <TableRow>
                        <TableCell align="left">
                          <AppsIcon sx={{ ml: 1, mt: 1 }} />
                        </TableCell>
                        <TableCell align="left">Username</TableCell>
                        <TableCell align="left">TimeBegin&nbsp;</TableCell>
                        <TableCell align="left">TimeEnd&nbsp;</TableCell>
                        <TableCell align="left">Weekdays&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currTimetable.map((dt, index) => (
                        <TableRow
                          key={dt.userName}
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
                                {dt.userName}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {dt.timeBegin}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {dt.timeEnd}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {dt.weekdays}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <Button
                            style={{
                              borderRadius: 35,
                              backgroundColor: "#21b6ae",
                              padding: "9px 18px",
                              fontSize: "12px"
                            }}
                            variant="contained"
                            onClick={() => handleEditItem(dt.userId)}
                          >
                            Edit
                            {/* <Link to=`/edit/timetable/${user_id}` style={{ textDecoration: 'none', color: "white" }}>Edit</Link> */}
                          </Button>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value="5">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          <AppsIcon sx={{ ml: 1, mt: 1 }} />
                        </TableCell>
                        <TableCell align="left">Driver</TableCell>
                        <TableCell align="left">Order&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currMany.map((man, index) => (
                        <TableRow
                          key={man.driver_id}
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
                                {man.driver_id}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                          <TableCell align="left">
                            <MuiLink underline="hover" color="text.primary">
                              <Typography fontSize={14}>
                                {man.order_id}
                              </Typography>
                            </MuiLink>
                          </TableCell>
                         
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

            </TabContext>
          </Container>
        </Container>
      </Box>
    </div >
  );
};

export default HomePageAdmin;
