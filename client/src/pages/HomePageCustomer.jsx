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
  const [currItems, setCurrItems] = useState([]);
  const [projectsTab, setProjectsTab] = useState("1");

  const handleProjectsTabIndexChange = (e, newValue) => {
    setProjectsTab(newValue);
  };

  function handleCreation() {
    navigate(`/orders/create/${userId}`);
  }

  // useEffect(() => {
  //   async function fetchProjects() {
  //     let response = await api.get(`/ord/${userId}`);
  //     response = await response.data.projects;
  //     setCurrItems(response);
  //   }
  //   fetchProjects();
  // }, [userId, navigate]);

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
                    placeholder="Filter by name..."
                    sx={{ pl: 17 }}
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
                        <TableCell align="left">Time&nbsp;</TableCell>
                        <TableCell align="left">Address to&nbsp;</TableCell>
                        <TableCell align="left">Order file&nbsp;</TableCell>
                        <TableCell align="left">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currItems.map((item, index) => (
                        <TableRow
                          key={item.project_id}
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
                            <Avatar sx={{ bgcolor: "#193639" }}>
                              {item.project_name.charAt(0)}
                            </Avatar>
                          </TableCell>
                          <TableCell align="left">
                            <Breadcrumbs
                              aria-label="breadcrumb"
                              onClick={() => {
                                navigate(`/orders/${item.project_id}/${userId}`);
                              }}
                            >
                              <MuiLink
                                underline="hover"
                                color="inherit"
                                fontSize={14}
                              >
                                {item.creator}
                              </MuiLink>
                              <MuiLink underline="hover" color="text.primary">
                                <Typography fontSize={14}>
                                  {item.project_name}
                                </Typography>
                              </MuiLink>
                            </Breadcrumbs>
                          </TableCell>
                          <TableCell align="left">
                            {item.project_status === true ? (
                              <Chip
                                label="working"
                                color="success"
                                variant="outlined"
                                icon={<CheckCircleIcon />}
                              />
                            ) : (
                              <Chip
                                label="stopped"
                                color="error"
                                variant="outlined"
                                icon={<DoDisturbOnIcon color="error" />}
                              />
                            )}
                          </TableCell>
                          <TableCell align="left">
                            <Chip
                              label={item.project_platform}
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell align="left">
                            {item.last_updated}
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
