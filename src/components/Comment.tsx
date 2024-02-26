import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
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

interface Props {
  key: string;
  postid: string;
  postAuthorId: string;
  authorid: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  commentid: string;
}

const Comment = (props: Props) => {
  const [photo, setPhoto] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [editAuthorized, setEditAuthorized] = useState<boolean>(false);
  const [deleteAuthorized, setDeleteAuthorized] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [commentText, setCommentText] = useState<string>("");
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

  const deleteComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!props.postid || !props.commentid) {
      console.log("Missing variables");
      return;
    }

    try {
      const res = await fetch(
        //"/:postid/comments/:commentid"
        `https://odin-facebook-api.onrender.com/api/posts/${props.postid}/comments/${props.commentid}`,
        {
          method: "DELETE",
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
      } else {
        if (resJson.result) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    //TODO edit api and check function
    if (!props.postid || !props.commentid) {
      console.log("Missing variables");
      return;
    }

    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/${props.postid}/comments/${props.commentid}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText,
          }),
        }
      );

      const resJson = await res.json();

      if (resJson.errors) {
        console.log(resJson.errors);
      } else if (resJson.error) {
        console.log(resJson.error);
      } else {
        if (resJson.success) {
          // comment updated
          console.log("comment updated");
          setReadOnly(true);
        } else {
          console.log("unable to update comment");
          setCommentText(props.text);
          setReadOnly(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const allowEditComment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setReadOnly(false);
  };

  const cancelEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setReadOnly(true);
  };

  const handleCommentTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setCommentText(event.target.value);
  };

  useEffect(() => {
    if (props.authorid) {
      fetchProfile(props.authorid);
    }
  }, [props.authorid]);

  useEffect(() => {
    if (props.text) {
      setCommentText(props.text);
    }
  }, [props.text]);

  useEffect(() => {
    // check if access to edit/delete comment granted

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

  /**
   * profile pic, name, date
   * comment
   * edit buttons delete button
   *
   *
   */

  return (
    <>
      <Box>
        <Grid container>
          <Grid container item style={{ padding: "5px" }}>
            <Grid item>
              <ProfilePhoto username={props.username} photo={photo} size={50} />
            </Grid>
            <Grid item style={{ paddingLeft: "12px" }}>
              <p style={{ textAlign: "left", margin: 0 }}>{props.username}</p>
              <p style={{ textAlign: "left", margin: 0 }}>{updatedAt}</p>
            </Grid>
          </Grid>
          <Grid item style={{ padding: "5px" }}>
            <Box component="form" noValidate>
              <Textarea
                aria-label="post textarea"
                maxRows={10}
                maxLength={1000}
                readOnly={readOnly}
                onChange={handleCommentTextChange}
                value={commentText}
                style={{
                  resize: "none",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  textAlign: "left",
                }}
              />
            </Box>
            <Grid item container justifyContent={"flex-start"}>
              {editAuthorized ? (
                readOnly ? (
                  <IconButton aria-label="edit" onClick={allowEditComment}>
                    <ModeEditIcon />
                  </IconButton>
                ) : (
                  <>
                    <IconButton aria-label="update" onClick={editComment}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton aria-label="cancel" onClick={cancelEdit}>
                      <ClearIcon />
                    </IconButton>
                  </>
                )
              ) : null}
              {deleteAuthorized ? (
                <IconButton aria-label="delete" onClick={deleteComment}>
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Comment;
