import { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import SearchResult from "./SearchResult";

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

const Friends = () => {
  const [profileFriends, setProfileFriends] = useState<Array<friend>>([]);

  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          `https://odin-facebook-api.onrender.com/api/users/${decoded.user._id}/friends`,
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
          setProfileFriends(resJson.friends);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (decoded.user._id) {
      fetchFriends();
    }
  }, [decoded.user._id]);
  return (
    <>
      <h1>Friends Page</h1>
      {profileFriends.length > 0
        ? profileFriends.map((result) => {
            return (
              <SearchResult
                key={result.recipient}
                profileId={result.recipient}
              />
            );
          })
        : null}
    </>
  );
};

export default Friends;
