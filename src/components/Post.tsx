import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

import ProfilePhoto from "./ProfilePhoto";

const Post = (props) => {
  const [photo, setPhoto] = useState<string>("");
  const [readOnly, setReadOnly] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async (id: string) => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${id}/profile`,
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
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (props.authorid) {
      fetchProfile(props.authorid);
    }
  }, [props.authorid]);
  return (
    <>
      <Box style={{ width: "80%" }}>
        <Grid container spacing={2}>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs="auto">
              <ProfilePhoto username={props.username} photo={photo} size={75} />
            </Grid>
            <Grid item xs={8}>
              <p style={{ textAlign: "left" }}>{props.username}</p>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item>
              <Box component="form" noValidate>
                <Textarea
                  aria-label="post textarea"
                  maxRows={10}
                  maxLength={1000}
                  readOnly={readOnly}
                  //onChange={handleTextChange}
                  value={props.text}
                  style={{
                    resize: "none",
                    width: "80%",
                    border: "none",
                    outline: "none",
                    textAlign: "left",
                  }}
                />
              </Box>
            </Grid>
            <Grid item style={{ textAlign: "left" }}>
              <Button type="button" variant="contained">
                Like
              </Button>
              <Button type="button" variant="contained">
                Comment
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Post;
