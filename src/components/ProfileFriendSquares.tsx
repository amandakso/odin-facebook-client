import { useState, useEffect } from "react";
import ProfileFriendSquare from "./ProfileFriendSquare";
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

  useEffect(() => {
    console.log("test");
    if (friends) {
      if (friends.length > 9) {
        setProfilesToDisplay(friends.slice(0, 9));
      } else {
        setProfilesToDisplay(friends);
      }
    }
  }, [friends]);

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
    </>
  );
};

export default ProfileFriendSquares;
