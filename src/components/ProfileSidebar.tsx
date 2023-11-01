import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import SimpleDialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogValue, setDialogValue] = useState("none");

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
          console.log(resJson.message);
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
          console.log(resJson.message);
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
      {profileStatus === "pending" ? (
        <SimpleDialog
          open={true}
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
