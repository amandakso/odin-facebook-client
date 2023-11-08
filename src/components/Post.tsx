import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";
import { useEffect, useState } from "react";

import ProfilePhoto from "./ProfilePhoto";

const Post = (props) => {
  const [photo, setPhoto] = useState<string>("");

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
      <Box>
        <ProfilePhoto username={props.username} photo={photo} size={75} />
        <h3>{props.username}</h3>
        <Box component="form" noValidate>
          <Textarea
            aria-label="post textarea"
            maxRows={10}
            maxLength={1000}
            readOnly={true}
            //onChange={handleTextChange}
            value={props.text}
            style={{ resize: "none", width: "80%" }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Post;
