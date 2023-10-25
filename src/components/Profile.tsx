import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import jwtDecode, { JwtPayload } from "jwt-decode";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

// Need to get profile info
// friend profile if own profile
// need to check friend status if not own profile
// posts

const Profile = () => {
  const { username } = useParams<{ username?: string }>();
  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentUser: string | undefined = decoded.user._id;
  const [profileStatus, setProfileStatus] = useState<
    "self" | "friend" | "requested" | "pending" | "other" | null
  >(null);

  // Check if profile status
  useEffect(() => {
    const getProfileId = async () => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/username-search/${username}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resJson = await res.json();
        const profileId = await resJson._id;

        if (profileId === currentUser) {
          setProfileStatus("self");
          console.log("self");
        } else {
          // check friendship status of other use
          try {
            const res = await fetch(
              `https://odin-facebook-api.onrender.com/api/users/check-friendship/${currentUser}/${profileId}`,
              {
                method: "GET",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const resJson = await res.json();
            const status = await resJson.status;

            //status: 0 (add friend); 1 (requested); 2 (pending); 3 (friends)
            if (status === 1) {
              setProfileStatus("requested");
            } else if (status === 2) {
              setProfileStatus("pending");
            } else if (status === 3) {
              setProfileStatus("friend");
            } else {
              setProfileStatus("other");
            }
          } catch (err) {
            console.log(err);
          }
          // TODO write api for checking friendship status
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProfileId();
  }, [currentUser, username]);
  // Get current profile info: photo, bio, username; check status
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/profile`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resJson = await res.json();
      } catch (err) {
        console.log(err);
      }
    };
    //fetchProfile();
  }, [decoded.user._id]);

  return (
    <>
      <h1> {username} profile</h1>
    </>
  );
};

export default Profile;
