import { useEffect, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

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
  const [confirmedFriends, setConfirmedFriends] = useState<Array<friend>>([]);
  const [pendingFriends, setPendingFriends] = useState<Array<friend>>([]);

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
          const pendingFriends = [];
          const confirmedFriends = [];
          const allFriends = resJson.friends;
          allFriends.forEach((friend) => {
            if (friend.status === 3) {
              confirmedFriends.push(friend);
            } else if (friend.status === 2) {
              pendingFriends.push(friend);
            } else {
              return;
            }
          });
          setConfirmedFriends(confirmedFriends);
          setPendingFriends(pendingFriends);
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
      <Grid container direction={"column"} alignItems={"center"}>
        <Grid item>
          <h1>Friend Requests</h1>
        </Grid>
        {pendingFriends.length > 0
          ? pendingFriends.map((result) => {
              return (
                <Grid item key={result.recipient}>
                  <SearchResult profileId={result.recipient} />
                </Grid>
              );
            })
          : null}
        <Divider />
        <Grid item>
          <h1>Friends Page</h1>
        </Grid>
        {confirmedFriends.length > 0
          ? confirmedFriends.map((result) => {
              return (
                <Grid item key={result.recipient}>
                  <SearchResult profileId={result.recipient} />
                </Grid>
              );
            })
          : null}
      </Grid>
    </>
  );
};

export default Friends;
