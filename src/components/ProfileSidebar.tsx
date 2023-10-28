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

  async function clickFriendButton() {
    let text = " ";
    switch(profileStatus) {
      case("self"):
        console.log("test2")
        return
      case("friend"):
        text = "unfriend";
        break;
      case("requested"):
        break;
      case("pending"):
        console.log("test3")
        return 
      case("other"):
        break;
      default:
          console.log("error");
          return
    }
    console.log("test1");
    try {
      //const res = await fetch(`https://odin-facebook-api.onrender.com/api/users/{props.profileId}/friends/{text}`)
    }
    /*const fetchProfile = async () => {
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
    }; */
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
