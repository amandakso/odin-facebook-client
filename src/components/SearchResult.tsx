import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

import ProfilePhoto from "./ProfilePhoto";

interface Props {
  key: string;
  profileId: string;
}

const SearchResult = (props: Props) => {
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
          //   setProfileBio(resJson.bio);
          setPhoto(resJson.photo);
          setUsername(resJson.username);
          //   setProfileFriends(resJson.friends);
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
      <Grid item>
        <CardActionArea component="a" href={`/profile/${username}`}>
          <Card
            sx={{
              display: "flex",
            }}
          >
            <CardContent
              sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <ProfilePhoto username={username} photo={photo} size={100} />
                <Typography variant="subtitle1" paragraph>
                  {username}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    </>
  );
};

export default SearchResult;
