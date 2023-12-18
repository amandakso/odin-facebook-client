import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState, useCallback } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

import ProfilePhoto from "./ProfilePhoto";
import Comments from "./Comments";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

type likes = {
  _id: string;
  username: string;
};

type comment = {
  postid: string;
  author: { _id: string; username: string };
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string; // comment id
};

const Post = (props) => {
  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentUser = decoded.user._id;
  const [photo, setPhoto] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [editAuthorized, setEditAuthorized] = useState<boolean>(false);
  const [deleteAuthorized, setDeleteAuthorized] = useState<boolean>(false);
  const [numLikes, setNumLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<comment[] | null>(null);
  const [commentText, setCommentText] = useState<string>("");

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

  const fetchComments = async (postid: string) => {
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/${postid}/comments`,
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
        setComments(resJson.comments);
      }
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
      } else {
        const likes = resJson.likes ? resJson.likes.users : [];
        setIsLiked(true);
        setNumLikes(likes.length ? likes.length : 0);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDislikeClick = async (
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
        `https://odin-facebook-api.onrender.com/api/posts/${postid}/likes/unlike`,
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
      } else {
        const likes = resJson.likes ? resJson.likes.users : [];
        setIsLiked(false);
        setNumLikes(likes.length ? likes.length : 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    console.log(event.target.value);
  };

  const editPost = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("TBD");
  };

  const allowEditPost = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setReadOnly(false);
  };

  const cancelEditPost = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setReadOnly(true);
  };

  const deletePost = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("TBD");
  };

  const handleCommentTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const postid = props.postid;
    if (!postid) {
      console.log("No postid found");
      return;
    }
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/${postid}/comments`,
        {
          method: "POST",
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
        if (resJson.data) {
          console.log("resJson.data: " + resJson.data.comment);
          setComments((prev) => [...(prev as comment[]), resJson.data]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // check if access to edit/delete post authorized

    if (currentUser) {
      if (!props.authorid) {
        setEditAuthorized(false);
        setDeleteAuthorized(false);
      } else {
        if (props.authorid === currentUser) {
          setEditAuthorized(true);
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
  }, [currentUser, props.authorid]);

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

  useEffect(() => {
    if (props.authorid) {
      fetchProfile(props.authorid);
    }
  }, [props.authorid]);

  useEffect(() => {
    if (props.postid) {
      fetchComments(props.postid);
    }
  }, [props.postid]);

  useEffect(() => {
    const checkIfLiked = (likes: likes[]) => {
      likes.forEach((like) => {
        if (like._id === currentUser) {
          setIsLiked(true);
          return;
        }
      });
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
        const likes = resJson.likes ? resJson.likes.users : [];
        checkIfLiked(likes);
        setNumLikes(likes.length ? likes.length : 0);
      } catch (err) {
        console.log(err);
      }
    };
    if (props.postid) {
      getPostLikes(props.postid);
    }
  }, [props.postid, currentUser]);

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
                  readOnly={readOnly}
                  onChange={handlePostTextChange}
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
              {editAuthorized ? (
                readOnly ? (
                  <IconButton aria-label="edit" onClick={allowEditPost}>
                    <ModeEditIcon />
                  </IconButton>
                ) : (
                  <>
                    <IconButton aria-label="update" onClick={editPost}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton aria-label="cancel" onClick={cancelEditPost}>
                      <ClearIcon />
                    </IconButton>
                  </>
                )
              ) : null}
              {deleteAuthorized ? (
                <IconButton aria-label="delete" onClick={deletePost}>
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Grid>
            <Grid item style={{ textAlign: "left" }}>
              <p>
                {numLikes} {numLikes === 1 ? "like" : "likes"}
              </p>
              {isLiked ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleDislikeClick}
                >
                  Unlike
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleLikeClick}
                >
                  Like
                </Button>
              )}
            </Grid>
          </Grid>
          {props.postid ? (
            <Grid item xs={12}>
              <Comments comments={comments} postAuthorId={props.authorid} />
            </Grid>
          ) : null}
        </Grid>
        <Grid item xs={12} style={{ textAlign: "left", alignItems: "center" }}>
          <Box component="form" noValidate onSubmit={submitComment}>
            <Grid container>
              <TextField
                id="commentField"
                label="comment"
                variant="outlined"
                placeholder="Write a comment."
                multiline
                inputProps={{ maxLength: 500 }}
                value={commentText}
                onChange={handleCommentTextChange}
              />
              <Button type="submit" variant="contained">
                Comment
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Post;
