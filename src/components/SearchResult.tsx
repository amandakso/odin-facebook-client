import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import ProfilePhoto from "./ProfilePhoto";

const SearchResult = (props) => {
  const [photo, setPhoto] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async (profileId: string) => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${profileId}/profile`,
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
          //   setProfileBio(resJson.bio);
          setPhoto(resJson.photo);
          //   setProfileFriends(resJson.friends);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (props.profileId) {
      fetchProfile(props.profileId);
    }
  }, [props.profileId]);
  return (
    <>
      <Link to={`/profile/${props.username}`}>
        <div>
          <ProfilePhoto username={props.username} photo={photo} size={100} />
          <h1>{props.username}</h1>
        </div>
      </Link>
    </>
  );
};

export default SearchResult;
