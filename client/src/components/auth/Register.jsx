import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField, Button, Grid, Select, MenuItem } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "./api";
// import LoadingButton from "@mui/lab/LoadingButton";

const Register = ({ }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  //   const [loading, setLoading] = React.useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();


  const onChangeRole = (event) => {
    setRole(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleClick = (e, reason) => {
    // setLoading(true);
    const sep_users = {
      sep_emails: email,
      sep_usernames: username,
      sep_passwords: password,
      sep_roles: role
    };
    async function sendRequest() {
      await api
        .post(`/add_profile`, sep_users)
        .then((resp) => {
          console.log(resp.status);
          if (
            resp.status === 200 ||
            resp.status === 201 ||
            resp.status === 204
          ) {
            navigate('/')
            // setLoading(false);
          }
          if (
            resp.status === 203
          ) {
            setResult("This username is already taken");
            // setLoading(false);
          }
        });
    }
    sendRequest();
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          m: 20,
          pt: 10,
          pr: 25,
          pl: 25,
        }}
      >
        <Typography fontWeight={700}
          variant="h5"
          align="center"
        >Sign up</Typography>
        <TextField
          margin="normal"
          label="Username"
          variant="outlined"
          autoComplete="current-login"
          name="userName"
          value={username}
          onChange={onChangeUsername}
        />
        <TextField
          margin="normal"
          label="Email"
          variant="outlined"
          autoComplete="current-email"
          type="email"
          name="mail"
          value={email}
          onChange={onChangeEmail}
        />
        <TextField
          margin="normal"
          padding="normal"
          type="password"
          label="Password"
          variant="outlined"
          autoComplete="current-password"
          name="password"
          value={password}
          onChange={onChangePassword}
        />
        <Select
          label="Role"
          variant="outlined"
          name="role"
          value={role}
          onChange={onChangeRole}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="driver">Driver</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>

        {result && <p style={{ color: "red" }}>{result}</p>}
        <Button
          sx={{ marginTop: 2, backgroundColor: "#21b6ae" }}
          onClick={handleClick}
          //   loading={loading}
          variant="contained"
          disableElevation
        //   disabled={loading}
        >
          Sign up
        </Button>
        <Button type="submit" variant="contained" sx={{ mb: 3, mt: 3, backgroundColor: "#21b6ae" }}  >
          <Link to="/" style={{ textDecoration: 'none', color: "white" }} >Sign in</Link>
        </Button>
      </Box>
    </div>
  );
};

export default Register;
