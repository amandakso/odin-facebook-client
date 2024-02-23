import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfileFriendSquare from "./ProfileFriendSquare";
import Button from "@mui/material/Button";

type friend = {
  createdAt: string; // date
  recipient: string; // userid
  requester: string; //userid
  status: number; // 0-3
  updatedAt: string; // date
  __v: number;
  _id: string; // friendship id
};

const ProfileFriendSquares = (props) => {
  const friends: Array<friend> | undefined = props.friends;
  const [profilesToDisplay, setProfilesToDisplay] = useState<Array<friend>>([]);

  const filteredFriends = useMemo(() => {
    const filteredArr: friend[] = [];
    friends?.forEach((friend) => {
      if (friend.status == 3) {
        filteredArr.push(friend);
      }
    });
    return filteredArr;
  }, [friends]);

  const navigate = useNavigate();

  const handleFriendsClick = () => {
    navigate("/friends");
  };

  useEffect(() => {
    if (filteredFriends) {
      if (filteredFriends.length > 9) {
        setProfilesToDisplay(filteredFriends.slice(0, 9));
      } else {
        setProfilesToDisplay(filteredFriends);
      }
    }
  }, [filteredFriends]);

  return (
    <>
      <h1>Friends</h1>
      {profilesToDisplay.map((friend) => {
        return (
          <ProfileFriendSquare
            key={friend.recipient}
            profileId={friend.recipient}
          />
        );
      })}
      <Button variant="text" onClick={handleFriendsClick}>
        See All
      </Button>
    </>
  );
};

export default ProfileFriendSquares;
