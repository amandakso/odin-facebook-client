import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import SimpleDialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";

import ProfilePhoto from "./ProfilePhoto";
import ProfileFriendSquares from "./ProfileFriendSquares";

type friend = {
  createdAt: string; // date
  recipient: string; // userid
  requester: string; //userid
  status: number; // 0-3
  updatedAt: string; // date
  __v: number;
  _id: string; // friendship id
};

type profileStatusType =
  | "self"
  | "friend"
  | "requested"
  | "pending"
  | "other"
  | "none"
  | null;

interface Props {
  profileId: string | null;
  username: string | undefined;
  bio: string | null;
  photo: string | null;
  friends: friend[] | null;
  status: profileStatusType;
}

const ProfileSidebar = (props: Props): JSX.Element => {
  const token: string = sessionStorage.getItem("token") as string;
  const profileStatus: profileStatusType = props.status;
  const profileFriends: Array<friend> | null = props.friends;
  const [friendButtonText, setFriendButtonText] = useState<string | null>(null);
  const [friendButtonVisible, setFriendButtonVisible] =
    useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
        window.location.reload();
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
    setDialogOpen(true);
  }

  async function respondToFriend(response: string) {
    if (response === "confirm") {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${props.profileId}/friends/accept-friend`,
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
        if (resJson.status === "success") {
          window.location.reload();
        }
        if (resJson.status === "error") {
          console.log(resJson.error);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (response === "deny") {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${props.profileId}/friends/reject-friend`,
          {
            method: "DELETE",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${token}`,
            },
          }
        );
        const resJson = await res.json();
        if (resJson.status === "success") {
          window.location.reload();
        }
        if (resJson.status === "error") {
          console.log(resJson.error);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("error");
      return;
    }
  }

  async function deleteFriend() {
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/users/${props.profileId}/friends/unfriend`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );
      const resJson = await res.json();
      if (resJson.status === "success") {
        window.location.reload();
      }
      if (resJson.status === "error") {
        console.log(resJson.error);
      }
    } catch (err) {
      console.log(err);
    }
  }
  // control button features
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
      <ProfilePhoto username={props.username} photo={props.photo} size={200} />
      <div>{props.username}</div>

      {profileFriends ? (
        profileFriends.length > 0 ? (
          <ProfileFriendSquares
            friends={profileFriends}
            profile={profileStatus}
          />
        ) : (
          <ProfileFriendSquares friends={[]} profile={profileStatus} />
        )
      ) : (
        <ProfileFriendSquares friends={[]} profile={profileStatus} />
      )}
      {friendButtonVisible ? (
        <Button
          variant="contained"
          disabled={profileStatus === "requested" || null ? true : false}
          onClick={clickFriendButton}
        >
          {friendButtonText}
        </Button>
      ) : null}
      {profileStatus === "pending" ? (
        <SimpleDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(dialogOpen);
          }}
        >
          <Box mx={4} my={4} display="flex" alignItems="center" gap={3}>
            <h3>Become friends? </h3>
            <Button
              variant="contained"
              onClick={() => respondToFriend("confirm")}
            >
              CONFIRM
            </Button>
            <Button variant="contained" onClick={() => respondToFriend("deny")}>
              DENY
            </Button>
          </Box>
        </SimpleDialog>
      ) : null}
    </>
  );
};

export default ProfileSidebar;
