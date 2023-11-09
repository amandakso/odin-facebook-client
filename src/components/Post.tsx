import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import ProfilePhoto from "./ProfilePhoto";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

const Post = (props) => {
  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const [photo, setPhoto] = useState<string>("");
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [numLikes, setNumLikes] = useState<number>(0);
  //const [isLiked, setIsLiked] = useState<boolean>(false);

  const fetchProfile = async (authorid: string) => {
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/users/${authorid}/profile`,
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
  const getPostLikes = async (postid: string) => {
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/${postid}/likes`,
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
      }
      const likes = resJson.likes ? resJson.likes.users.length : 0;

      setNumLikes(likes ? likes : 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikeClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const postid = props.postid;
    if (!postid) {
      console.log("No postid found");
      return;
    }
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/${postid}/likes/like`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const resJson = await res.json();

      if (resJson.error) {
        console.log(resJson.error);
      }
      const likes = resJson.likes ? resJson.likes.users.length : 0;
      setNumLikes(likes ? likes : 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (props.authorid) {
      fetchProfile(props.authorid);
    }
  }, [props.authorid]);

  useEffect(() => {
    if (props.postid) {
      getPostLikes(props.postid);
    }
  }, [props.postid]);

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
              <p>
                {numLikes} {numLikes === 1 ? "like" : "likes"}
              </p>
              <Button
                type="button"
                variant="contained"
                onClick={handleLikeClick}
              >
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
