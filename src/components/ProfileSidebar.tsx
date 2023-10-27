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

  useEffect(() => {
    switch (profileStatus) {
      case "self":
        console.log("self");
        setFriendButtonVisible(false);
        setFriendButtonText(null);
        break;
      case "friend":
        setFriendButtonVisible(true);
        setFriendButtonText("Unfriend");
        console.log("friend");
        break;
      case "requested":
        setFriendButtonVisible(true);
        setFriendButtonText("Friend Request Sent");
        console.log("requested");
        break;
      case "pending":
        setFriendButtonVisible(true);
        setFriendButtonText("Confirm");
        console.log("pending");
        break;
      case "other":
        setFriendButtonVisible(true);
        setFriendButtonText(null);
        console.log("other");
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
        <Button variant="contained">{friendButtonText}</Button>
      ) : null}
    </>
  );
};

export default ProfileSidebar;