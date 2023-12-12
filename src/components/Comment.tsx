import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import ProfilePhoto from "./ProfilePhoto";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

const Comment = (props) => {
  const [photo, setPhoto] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [editAuthorized, setEditAuthorized] = useState<boolean>(false);
  const [deleteAuthorized, setDeleteAuthorized] = useState<boolean>(false);
  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentUser: string | undefined = decoded.user._id;

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

  const deleteComment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(props.commentid);
    console.log("delete comment button click");
  };

  useEffect(() => {
    if (props.authorid) {
      fetchProfile(props.authorid);
    }
  }, [props.authorid]);

  useEffect(() => {
    // check if access to edit/delete comment granted
    console.log("test");
    if (currentUser) {
      if (!props.authorid || !props.postAuthorId) {
        setEditAuthorized(false);
        setDeleteAuthorized(false);
      } else {
        if (props.authorid === currentUser) {
          setEditAuthorized(true);
          setDeleteAuthorized(true);
        } else if (props.postAuthorId === currentUser) {
          setEditAuthorized(false);
          setDeleteAuthorized(true);
        } else {
          setEditAuthorized(false);
          setDeleteAuthorized(false);
        }
      }
    } else {
      setEditAuthorized(false);
      setDeleteAuthorized(false);
    }
  }, [props.postAuthorId, props.authorid, currentUser]);

  useEffect(() => {
    if (props.updatedAt) {
      const date = new Date(props.updatedAt);
      setUpdatedAt(
        date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
  }, [props.updatedAt]);

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
              <p style={{ textAlign: "left" }}>{updatedAt}</p>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item>
              <Box component="form" noValidate>
                <Textarea
                  aria-label="post textarea"
                  maxRows={10}
                  maxLength={1000}
                  //readOnly={readOnly}
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
                {deleteAuthorized ? (
                  <IconButton aria-label="delete" onClick={deleteComment}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Comment;
