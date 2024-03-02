import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfileFriendSquare from "./ProfileFriendSquare";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

type friend = {
  createdAt: string; // date
  recipient: string; // userid
  requester: string; //userid
  status: number; // 0-3
  updatedAt: string; // date
  __v: number;
  _id: string; // friendship id
};

interface Props {
  friends: friend[];
}

const ProfileFriendSquares = (props: Props) => {
  const friends: Array<friend> | undefined = props.friends;
  const [profilesToDisplay, setProfilesToDisplay] = useState<Array<friend>>([]);
  const [numOfFriends, setNumOfFriends] = useState<number | null>(0);

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
      setNumOfFriends(filteredFriends.length);
      if (filteredFriends.length > 6) {
        setProfilesToDisplay(filteredFriends.slice(0, 6));
      } else {
        setProfilesToDisplay(filteredFriends);
      }
    }
  }, [filteredFriends]);

  return (
    <div
      style={{
        border: "solid black 1px",
        marginTop: "5vh",
        minWidth: "300px",
        minHeight: "300px",
      }}
    >
      <h1 style={{ fontSize: "1rem" }}>Friends &#40;{numOfFriends}&#41; </h1>
      <Grid container spacing={3}>
        {profilesToDisplay.map((friend) => {
          return (
            <Grid item key={friend.recipient}>
              <ProfileFriendSquare profileId={friend.recipient} />
            </Grid>
          );
        })}
      </Grid>
      <Button variant="text" onClick={handleFriendsClick}>
        See All
      </Button>
    </div>
  );
};

export default ProfileFriendSquares;
