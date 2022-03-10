import React, {  useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./login.css";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import api from "./api";
// import LoadingButton from "@mui/lab";
import { useNavigate, useParams } from "react-router";
import { cloneElement } from "react";

const Login = ({ }) => {

  const { userId } = useParams();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };


  const handleClick = (e, reason) => {
    // setLoading(true);
    const sep_users = {
      sep_emails: email,
      sep_passwords: password
    };
    async function sendRequest() {
      await api
        .post(`/login_profile`, sep_users)
        .then((resp) => {
          const userId = resp.data['id'];
          console.log(userId);
          console.log(resp.status);
          if (
            resp.status === 200 ||
            resp.status === 201 ||
            resp.status === 204
          ) {
            if (resp.data['role'] == "customer"){
              navigate(`/homepage/customer/${userId}`)
            }
            if (resp.data['role'] == "admin"){
              navigate(`/homepage/admin/${userId}`)
            }
            // setLoading(false);
          } 
          if (
            resp.status === 203
          ) 
           {
            setResult("Password is incorrect");
            // setLoading(false);
          }
          if (
            resp.status === 202
          ) 
           {
            setResult("No such user");
            // setLoading(false)
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
          align: "center",
          m: 20,
          pt: 15,
          pr: 25,
          pl: 25,
        }}
      >
        <Typography fontWeight={700}
          variant="h5"
          align="center"
        >Sign in</Typography>
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
          name="password"
          value={password}
          onChange={onChangePassword}
        />
        
        {result && <p style={{color: "red"}}>{result}</p>}
        <Button
          sx={{ marginTop: 1,
                mb: 3 }}
          onClick={handleClick}
        //   loading={loading}
          variant="contained"
        //   disableElevation
        //   disabled={loading}
        >
          Login
        </Button>
       
        <Button type="submit" variant="contained"  >
          <Link to="/register" style={{ textDecoration: 'none', color: "white" }}>Sign up</Link>
        </Button>



      </Box>
    </div>
  );
};

export default Login;
