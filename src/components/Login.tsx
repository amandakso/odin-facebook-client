import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import logo from "../assets/images/odinbook_logo.png";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Odinbook
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  type alertType = string | null;

  const [alert, setAlert] = useState<alertType>(null);
  const [open, setOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  async function loginGuest(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const res = await fetch(
        "https://odin-facebook-api.onrender.com/api/auth/login",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: process.env.GUEST_USERNAME,
            password: process.env.GUEST_PWD,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.error) {
          console.log(resJson.error);
        } else if (resJson.message) {
          console.log(resJson.message);
        } else if (resJson.token) {
          sessionStorage.setItem("token", resJson.token);
          navigate("/");
        } else {
          console.log("Unable to login as guest");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("username"));
    console.log(data.get("password"));
    try {
      const res = await fetch(
        "https://odin-facebook-api.onrender.com/api/auth/login",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.get("username"),
            password: data.get("password"),
          }),
        }
      );

      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.error) {
          setAlert(resJson.error);
          setOpen(true);
        } else if (resJson.message) {
          setAlert(resJson.message);
          setOpen(true);
        } else if (resJson.token) {
          if (alert) {
            setAlert(null);
          }
          if (open) {
            setOpen(false);
          }
          sessionStorage.setItem("token", resJson.token);
          navigate("/");
        } else {
          setAlert("Unable to login");
          setOpen(true);
        }
      }
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        setAlert(err.message);
        setOpen(true);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ width: "100%" }}>
        <Collapse in={open}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {alert}
          </Alert>
        </Collapse>
      </Box>

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ m: 1, width: 75, height: 75, bgcolor: "secondary.main" }}
          alt="logo"
          src={logo}
        />
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Link href="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
          <Button
            variant="outlined"
            sx={{ margin: "10px" }}
            onClick={loginGuest}
          >
            Try Guest Account
          </Button>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
}
