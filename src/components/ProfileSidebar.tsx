import { useEffect, useState } from "react";

import Button from "@mui/material/Button";

const ProfileSidebar = (props): JSX.Element => {
  type profileStatusType =
    | "self"
    | "friend"
    | "requested"
    | "pending"
    | "other"
    | null;
  const profileStatus: profileStatusType = props.status;
  const [friendButtonText, setFriendButtonText] = useState<string | null>(null);
  const [friendButtonVisible, setFriendButtonVisible] =
    useState<boolean>(false);

  function clickFriendButton() {
    console.log("TBD");
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
        console.log("error");
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
          disabled={profileStatus === "pending" || null ? true : false}
          onClick={clickFriendButton}
        >
          {friendButtonText}
        </Button>
      ) : null}
    </>
  );
};

export default ProfileSidebar;
