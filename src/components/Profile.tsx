import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import jwtDecode, { JwtPayload } from "jwt-decode";
import ProfileSidebar from "./ProfileSidebar";
import NewPost from "./NewPost";
import Posts from "./Posts";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

type friend = {
  createdAt: string; // date
  recipient: string; // userid
  requester: string; //userid
  status: number; // 0-3
  updatedAt: string; // date
  __v: number;
  _id: string; // friendship id
};

type post = {
  author: { _id: string; username: string };
  createdAt: string; // date
  text: string;
  updatedAt: string; // date
  __v: number;
  _id: string; //postid
};

const Profile = () => {
  const { username } = useParams<{ username?: string }>();
  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentUser: string | undefined = decoded.user._id;
  const [profileStatus, setProfileStatus] = useState<
    "self" | "friend" | "requested" | "pending" | "other" | null
  >(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileBio, setProfileBio] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileFriends, setProfileFriends] = useState<Array<friend> | null>(
    null
  );
  const [posts, setPosts] = useState<Array<post> | null>(null);

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
        const id = await resJson._id;

        if (id) {
          setProfileId(id);
        }

        if (id === currentUser) {
          setProfileStatus("self");
          console.log("self");
        } else {
          // check friendship status of other use
          try {
            const res = await fetch(
              `https://odin-facebook-api.onrender.com/api/users/check-friendship/${currentUser}/${id}`,
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
          setProfileBio(resJson.bio);
          setProfilePhoto(resJson.photo);
          setProfileFriends(resJson.friends);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  // Get posts if user is self or friend

  useEffect(() => {
    const getProfilePosts = async (id: string) => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/posts/user/${id}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:5173",
            },
          }
        );

        const resJson = await res.json();
        if (resJson.error) {
          console.log(resJson.error);
        } else if (resJson.posts) {
          setPosts(resJson.posts);
        } else {
          return;
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (profileStatus === "self" || profileStatus === "friend") {
      if (profileId) {
        getProfilePosts(profileId);
      }
    }
  }, [profileStatus, profileId]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid item>
            <h2>LEFT</h2>
            <ProfileSidebar
              profileId={profileId}
              username={username}
              bio={profileBio}
              photo={profilePhoto}
              friends={profileFriends}
              status={profileStatus}
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid item>
            <h2>RIGHT</h2>
            <NewPost />
            {posts ? <Posts posts={posts} /> : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
