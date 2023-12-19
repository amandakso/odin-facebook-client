import jwtDecode, { JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import HomeFeed from "./HomeFeed";

declare module "jwt-decode" {
  export interface JwtPayload {
    user: {
      username: string;
      _id: string;
    };
  }
}

const Home = () => {
  const token: string = sessionStorage.getItem("token") as string;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentUser: string | undefined = decoded.user._id;
  const [authors, setAuthors] = useState<Set<string>>(new Set<string>());
  // need friends id to get posts

  // fix set and storing friend userids and own

  useEffect(() => {
    const getFriends = async (user: string) => {
      if (user) {
        try {
          const res = await fetch(
            `https://odin-facebook-api.onrender.com/api/users/${currentUser}/friends`,
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
            const friendsArray = resJson.friends;
            const arr: string[] = [];
            friendsArray.forEach((item) => {
              if (item.status === 3) {
                const recipient: string = item.recipient;
                const requester: string = item.requester;
                if (recipient === currentUser) {
                  arr.push(requester);
                } else if (requester === currentUser) {
                  arr.push(recipient);
                } else {
                  console.log("error occurred");
                  return;
                }
              } else {
                return;
              }
            });
            setAuthors(new Set(arr));
          }
        } catch (err) {
          console.log(err);
          return;
        }
      } else {
        console.log("No current user");
        return;
      }
    };
    if (currentUser) {
      getFriends(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!authors.has(currentUser)) {
      setAuthors((prev) => prev.add(currentUser));
    }
  }, [currentUser, authors]);

  return (
    <>
      <h1>Home Page</h1>
      <HomeFeed authors={authors} />
    </>
  );
};

export default Home;
