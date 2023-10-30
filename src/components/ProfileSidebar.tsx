import { useEffect, useState } from "react";

import Button from "@mui/material/Button";

import jwtDecode, { JwtPayload } from "jwt-decode";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

const ProfileSidebar = (props): JSX.Element => {
  type profileStatusType =
    | "self"
    | "friend"
    | "requested"
    | "pending"
    | "other"
    | null;

  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const profileStatus: profileStatusType = props.status;
  const [friendButtonText, setFriendButtonText] = useState<string | null>(null);
  const [friendButtonVisible, setFriendButtonVisible] =
    useState<boolean>(false);

  function clickFriendButton() {
    switch (profileStatus) {
      case "self":
        return;
      case "friend":
        deleteFriend();
        break;
      case "requested":
        return;
      case "pending":
        confirmFriend();
        break;
      case "other":
        addFriend();
        break;
      default:
        console.log("error");
        return;
    }
  }

  async function addFriend() {
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/users/${props.profileId}/friends/add-friend`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );
      const resJson = await res.json();
      if (resJson.status === "success") {
        console.log(resJson.message);
      }
      if (resJson.status === "error") {
        console.log(resJson.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function confirmFriend() {
    console.log("TBD confirm friend");
    // add dialog modal to confirm or deny
  }

  function deleteFriend() {
    console.log("TBD delete friend");
    // delete friend
    // refresh page
  }

  useEffect(() => {
    switch (profileStatus) {
      case "self":
        setFriendButtonVisible(false);
        setFriendButtonText(null);
        break;
      case "friend":
        setFriendButtonVisible(true);
        setFriendButtonText("Unfriend");
        break;
      case "requested":
        setFriendButtonVisible(true);
        setFriendButtonText("Friend Request Sent");
        break;
      case "pending":
        setFriendButtonVisible(true);
        setFriendButtonText("Confirm");
        break;
      case "other":
        setFriendButtonVisible(true);
        setFriendButtonText("Add Friend");
        break;
      default:
        setFriendButtonText(null);
        setFriendButtonVisible(false);
    }
  }, [profileStatus]);
  return (
    <>
      <div>status: {profileStatus}</div>
      <div>id: {props.profileId}</div>
      <div>PROFILE IMG PLACEHOLDER</div>
      <div>FRIENDS LIST PLACEHOLDER</div>
      {friendButtonVisible ? (
        <Button
          variant="contained"
          disabled={profileStatus === "requested" || null ? true : false}
          onClick={clickFriendButton}
        >
          {friendButtonText}
        </Button>
      ) : null}
    </>
  );
};

export default ProfileSidebar;
