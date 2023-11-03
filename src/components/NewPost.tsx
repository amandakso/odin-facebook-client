import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Textarea from "@mui/material/TextareaAutosize";

const NewPost = () => {
  const [postText, setPostText] = useState<string>("");

  const createPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token: string = sessionStorage.getItem("token") as string;

    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            text: postText,
          }),
        }
      );
      const resJson = await res.json();

      if (resJson.errors) {
        console.log(resJson.errors);
      } else if (resJson.error) {
        console.log(resJson.error);
      } else if (resJson.success) {
        console.log(resJson.message);
        window.location.reload();
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  return (
    <>
      <Box component="form" onSubmit={createPost} noValidate>
        <Textarea
          aria-label="empty textarea"
          minRows={10}
          maxRows={10}
          maxLength={1000}
          onChange={handleTextChange}
          value={postText}
          placeholder="Create a new post!"
          style={{ resize: "none", width: "80%" }}
        />
        <p>Characters: {postText.length}/1000</p>

        <Button type="submit" variant="contained">
          Create Post
        </Button>
      </Box>
    </>
  );
};

export default NewPost;
