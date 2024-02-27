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

type errorType = {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: string;
};

export default function Signup() {
  type alertType = string | null;
  type alertSeverityType = "error" | "success";

  const [alert, setAlert] = useState<alertType>(null);
  const [alertSeverity, setAlertSeverity] =
    useState<alertSeverityType>("error");
  const [errors, setErrors] = useState<errorType[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      password: data.get("password"),
      password_confirmation: data.get("password_confirmation"),
    });
    try {
      const res = await fetch(
        "https://odin-facebook-api.onrender.com/api/auth/signup",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.get("username"),
            password: data.get("password"),
            password_confirmation: data.get("password_confirmation"),
          }),
        }
      );

      const resJson = await res.json();

      if (res.status === 200) {
        console.log(resJson);
        if (resJson.errors) {
          setErrors(resJson.errors);
          setAlert("Invalid submission: ");
          if (alertSeverity !== "error") {
            setAlertSeverity("error");
          }
          setOpen(true);
        } else if (resJson.error) {
          if (errors) {
            setErrors(null);
          }
          setAlert(resJson.error);
          if (alertSeverity !== "error") {
            setAlertSeverity("error");
          }
          setOpen(true);
        } else if (resJson.message) {
          if (errors) {
            setErrors(null);
          }
          setAlert(resJson.message);
          if (alertSeverity !== "success") {
            setAlertSeverity("success");
          }
          setOpen(true);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setAlert(err.message);
        if (alertSeverity !== "error") {
          setAlertSeverity("error");
        }
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
            severity={alertSeverity}
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
            <p>{alert}</p>
            <ul>
              {errors
                ? errors.map((err, index) => <li key={index}>{err.msg}</li>)
                : null}
            </ul>
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
          Sign in
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password_confirmation"
            label="Password Confirmation"
            type="password"
            id="password_confirmation"
            autoComplete="current-password_confirmation"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Link href="/odin-facebook-client/login" variant="body2">
            {"Already have an account? Log In"}
          </Link>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
}
