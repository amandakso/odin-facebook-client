import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
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
  const [profilePhoto, setProfilePhoto] = useState<BinaryData | null>(null);
  const [profileBio, setProfileBio] = useState<string>("");
  const [username, setUsername] = useState<string>("");
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
          alert(resJson.error);
          return;
        } else {
          console.log(resJson);
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
          console.log(err.message);
        }
      }
    };
    fetchProfile();
  }, []);
  return (
    <>
      <Container maxWidth="lg">
        <h1>Account Settings</h1>
        <Divider role="presentation">Update Profile Photo</Divider>
        <Divider role="presentation">Update Profile Bio</Divider>
        <Divider role="presentation">Update Username</Divider>
        <Divider role="presentation">Update Password</Divider>
      </Container>
    </>
  );
};

export default Settings;
