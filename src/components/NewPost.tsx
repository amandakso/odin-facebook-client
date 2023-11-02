import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Textarea from "@mui/material/TextareaAutosize";

const NewPost = (props) => {
  const [userid, setUserId] = useState<string | null>(null);
  const [postText, setPostText] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(true);

  const createPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(postText);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  useEffect(() => {
    if (props.id) {
      setUserId(props.id);
    }
  }, [props.id]);

  // disable button if id doesn't exist
  useEffect(() => {
    if (userid) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [userid]);

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

        <Button type="submit" variant="contained" disabled={disable}>
          Create Post
        </Button>
      </Box>
    </>
  );
};

export default NewPost;
