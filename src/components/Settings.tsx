import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { styled } from "@mui/material/styles";

import ProfilePhoto from "./ProfilePhoto";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

const Settings = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">(
    "error"
  );
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileBio, setProfileBio] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const updatePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const token: string = sessionStorage.getItem("token") as string;
    const decoded = jwtDecode<JwtPayload>(token);
    if (event.target.files) {
      const formdata = new FormData();
      formdata.append("picture", event.target.files[0]);

      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/profile/update-photo`,
          {
            method: "PUT",
            mode: "cors",
            headers: {
              Authorization: `bearer ${token}`,
              "Access-Control-Allow-Origin": "http://localhost:5173",
            },
            body: formdata,
          }
        );
        const resJson = await res.json();

        if (res.status === 200) {
          if (resJson.error) {
            setAlertMessage(resJson.error);
            if (alertSeverity != "error") {
              setAlertSeverity("error");
            }
            setSnackbarOpen(true);
          } else if (resJson.data) {
            setAlertMessage(resJson.message);
            if (alertSeverity != "success") {
              setAlertSeverity("success");
            }
            setSnackbarOpen(true);
            setProfilePhoto(resJson.data);
          } else {
            return;
          }
        } else {
          setAlertMessage("An error occurred. Unable to update photo.");
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setSnackbarOpen(true);
        }
      } catch (err) {
        if (err instanceof Error) {
          setAlertMessage(err.message);
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setSnackbarOpen(true);
        }
      }
    }
  };

  const updateBio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token: string = sessionStorage.getItem("token") as string;
    const decoded = jwtDecode<JwtPayload>(token);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/profile/update-bio`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            bio: data.get("bio"),
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.error) {
          setAlertMessage(resJson.error);
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setAlertMessage(resJson.error);
          setSnackbarOpen(true);
        } else if (resJson.data) {
          setAlertMessage(resJson.message);
          if (alertSeverity != "success") {
            setAlertSeverity("success");
          }
          setSnackbarOpen(true);
          setProfileBio(resJson.data);
        } else {
          return;
        }
      } else {
        if (resJson.errors) {
          setAlertMessage(
            "Invalid entry. Profile bio cannot be > 200 characters"
          );
        } else {
          setAlertMessage("An error occurred. Unable to update bio.");
        }
        if (alertSeverity != "error") {
          setAlertSeverity("error");
        }
        setSnackbarOpen(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
        if (alertSeverity != "error") {
          setAlertSeverity("error");
        }
        setSnackbarOpen(true);
      }
    }
  };

  const updateUsername = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token: string = sessionStorage.getItem("token") as string;
    const decoded = jwtDecode<JwtPayload>(token);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/profile/update-username`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            username: data.get("username"),
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.error) {
          setAlertMessage(resJson.error);
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setAlertMessage(resJson.error);
          setSnackbarOpen(true);
        } else if (resJson.data) {
          setAlertMessage(resJson.message);
          if (alertSeverity != "success") {
            setAlertSeverity("success");
          }
          setSnackbarOpen(true);
          setProfileBio(resJson.data);
        } else {
          return;
        }
      } else {
        if (resJson.errors) {
          setAlertMessage("Invalid entry. Unable to update username.");
        } else {
          setAlertMessage("An error occurred. Unable to update username.");
        }
        if (alertSeverity != "error") {
          setAlertSeverity("error");
        }
        setSnackbarOpen(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
        if (alertSeverity != "error") {
          setAlertSeverity("error");
        }
        setSnackbarOpen(true);
      }
    }
  };

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token: string = sessionStorage.getItem("token") as string;
    const decoded = jwtDecode<JwtPayload>(token);
    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/profile/update-pwd`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            password: data.get("password"),
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.error) {
          setAlertMessage(resJson.error);
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setAlertMessage(resJson.error);
          setSnackbarOpen(true);
        } else if (resJson.data) {
          setAlertMessage(resJson.message);
          if (alertSeverity != "success") {
            setAlertSeverity("success");
          }
          setSnackbarOpen(true);
          setProfileBio(resJson.data);
        } else {
          return;
        }
      } else {
        if (resJson.errors) {
          setAlertMessage("Invalid entry. Unable to update password.");
        } else {
          setAlertMessage("An error occurred. Unable to update password.");
        }
        if (alertSeverity != "error") {
          setAlertSeverity("error");
        }
        setSnackbarOpen(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
        if (alertSeverity != "error") {
          setAlertSeverity("error");
        }
        setSnackbarOpen(true);
      }
    }
  };

  // Get current profile info: photo, bio, username
  useEffect(() => {
    const token: string = sessionStorage.getItem("token") as string;
    const decoded = jwtDecode<JwtPayload>(token);
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/profile`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resJson = await res.json();
        if (resJson.error) {
          setAlertMessage(resJson.error);
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setSnackbarOpen(true);
          return;
        } else {
          if (resJson.photo) {
            setProfilePhoto(resJson.photo);
          }
          if (resJson.bio) {
            setProfileBio(resJson.bio);
          }
          setUsername(resJson.username);
        }
      } catch (err) {
        if (err instanceof Error) {
          setAlertMessage(err.message);
          if (alertSeverity != "error") {
            setAlertSeverity("error");
          }
          setSnackbarOpen(true);
          return;
        }
      }
    };
    fetchProfile();
  }, [alertSeverity]);

  return (
    <>
      <Container maxWidth="lg">
        <h1>Account Settings</h1>
        <Divider role="presentation">Update Profile Photo</Divider>
        <section>
          <Grid container columns={2}>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item xs>
                  <p>Current Photo:</p>
                </Grid>
                <Grid item xs>
                  <ProfilePhoto
                    username={username}
                    photo={profilePhoto}
                    size={250}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                  <p>New Photo:</p>
                </Grid>
                <Grid item>
                  <Grid container columns={2} alignItems="center" spacing={4}>
                    <Grid item>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Photo
                        <VisuallyHiddenInput
                          name="picture"
                          id="picture"
                          type="file"
                          accept="image/png, image/jpg, image/jpeg"
                          onChange={updatePhoto}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <Divider role="presentation">Update Profile Bio</Divider>
        <section>
          <Grid container columns={2}>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item xs>
                  <p>Current Bio:</p>
                </Grid>
                <Grid item xs>
                  <div>
                    <p>{profileBio}</p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                  <p>New Bio:</p>
                </Grid>
                <Grid item>
                  <Box component="form" onSubmit={updateBio} noValidate>
                    <Grid container columns={2} alignItems="center" spacing={4}>
                      <Grid item>
                        <TextField
                          margin="normal"
                          required
                          id="bio"
                          label="New Bio: "
                          name="bio"
                          autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <Button type="submit" variant="contained">
                          Update Bio
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <Divider role="presentation">Update Username</Divider>
        <section>
          <Grid container columns={2}>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item xs>
                  <p>Current Username:</p>
                </Grid>
                <Grid item xs>
                  <div>
                    <p>{username}</p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                  <p>New Username:</p>
                </Grid>
                <Grid item>
                  <Box component="form" onSubmit={updateUsername} noValidate>
                    <Grid container columns={2} alignItems="center" spacing={4}>
                      <Grid item>
                        <TextField
                          margin="normal"
                          required
                          id="username"
                          label="New Username: "
                          name="username"
                          autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <Button type="submit" variant="contained">
                          Update Username
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <Divider role="presentation">Update Password</Divider>
        <section>
          <Grid container columns={2}>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item xs>
                  <p>Current Password:</p>
                </Grid>
                <Grid item xs>
                  <div>
                    <p></p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                  <p>New Password:</p>
                </Grid>
                <Grid item>
                  <Box component="form" onSubmit={updatePassword} noValidate>
                    <Grid container columns={2} alignItems="center" spacing={4}>
                      <Grid item>
                        <TextField
                          margin="normal"
                          required
                          id="password"
                          label="New Password: "
                          name="password"
                          autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <Button type="submit" variant="contained">
                          Update Password
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Settings;
