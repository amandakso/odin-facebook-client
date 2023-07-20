import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

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
  const [profilePhoto, setProfilePhoto] = useState<BinaryData | null>(null);
  const [profileBio, setProfileBio] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const updateUsername = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("tbd");
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
