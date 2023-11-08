import Box from "@mui/material/Box";
import Textarea from "@mui/material/TextareaAutosize";

import ProfilePhoto from "./ProfilePhoto";

const Post = (props) => {
  return (
    <>
      <Box>
        <ProfilePhoto username={props.username} size={75} />
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
