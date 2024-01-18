import { useState, useEffect } from "react";
import ProfilePhoto from "./ProfilePhoto";
import Box from "@mui/material/Box";

const ProfileFriendSquare = (props) => {
  const [photo, setPhoto] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async (profileId: string) => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${profileId}/profile`,
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
          console.log(resJson.error);
        } else {
          setPhoto(resJson.photo);
          setUsername(resJson.username);
          console.log(resJson.photo);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (props.profileId) {
      fetchProfile(props.profileId);
    }
  }, [props.profileId]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 1,
          m: 1,
        }}
      >
        <ProfilePhoto username={username} photo={photo} size={75} />
        <p>{username}</p>
      </Box>
    </>
  );
};

export default ProfileFriendSquare;
