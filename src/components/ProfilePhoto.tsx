import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";

const ProfilePhoto = (props) => {
  const [username, setUsername] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  function convertBufferToFile(photo: string) {
    const buffer = Buffer.from(photo);
    // Create a Blob object from the buffer
    const blob = new Blob([buffer]);
    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);
    setPhotoUrl(url);
  }

  useEffect(() => {
    setUsername(props.username);
    setPhoto(props.photo);
  }, [props.username, props.photo]);

  useEffect(() => {
    if (photo) {
      convertBufferToFile(photo);
    }
  }, [photo]);

  return (
    <>
      <Avatar
        sx={{ bgcolor: blue[500], width: props.size, height: props.size }}
        alt={`${username}`}
        src={`${photoUrl}`}
      />
    </>
  );
};

export default ProfilePhoto;
