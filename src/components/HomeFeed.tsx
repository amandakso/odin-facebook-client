import { useEffect, useState } from "react";
import Posts from "./Posts";

import Grid from "@mui/material/Grid";

type post = {
  author: { _id: string; username: string };
  createdAt: string; // date
  text: string;
  updatedAt: string; // date
  __v: number;
  _id: string; //postid
};

const HomeFeed = (props) => {
  const [authors, setAuthors] = useState<Set<string>>(new Set<string>());
  const [authorsAdded, setAuthorsAdded] = useState<Set<string>>(
    new Set<string>()
  );
  const [posts, setPosts] = useState<post[]>([]);
  const [sortedPosts, setSortedPosts] = useState<post[]>([]);

  const fetchPosts = async (userid: string) => {
    try {
      const res = await fetch(
        `https://odin-facebook-api.onrender.com/api/posts/user/${userid}/`,
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
        return;
      } else if (resJson.posts) {
        if (resJson.posts.length > 0) {
          setPosts((prev) => prev.concat(resJson.posts));
        }
        return;
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (props.authors) {
      setAuthors(props.authors);
    }
  }, [props.authors]);

  useEffect(() => {
    if (authors.size > 0) {
      const arr = [...authors];
      arr.map((author) => {
        if (!authorsAdded.has(author)) {
          // prevent repeating adding posts from an author
          setAuthorsAdded((prev) => prev.add(author));
          fetchPosts(author);
        }
      });
    }
  }, [authors, authorsAdded]);

  useEffect(() => {
    if (posts.length > 0) {
      //sort posts
      const sorted = posts.sort((a, b) => {
        const dateA = new Date(a.updatedAt).valueOf();
        const dateB = new Date(b.updatedAt).valueOf();
        // console.log("dateA: " + dateA);
        // console.log("dateB: " + dateB);
        if (dateA > dateB) {
          return -1;
        }
        return 1;
      });

      setSortedPosts(sorted);
    }
  }, [posts]);

  return (
    <>
      <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Posts posts={sortedPosts} />
      </Grid>
    </>
  );
};

export default HomeFeed;
