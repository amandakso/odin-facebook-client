import { useEffect, useState } from "react";

type post = {
  author: { _id: string; username: string };
  createdAt: string; // date
  text: string;
  updatedAt: string; // date
  __v: number;
  _id: string; //postid
};

const HomeFeed = (props) => {
  const [authors, setAuthors] = useState<string[]>([]);
  const [posts, setPosts] = useState<post[][]>([]);

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
      } else if (resJson.posts) {
        if (resJson.posts.length > 0) {
          setPosts((prev) => prev.concat(resJson.posts));
        }
        console.log(resJson.posts);
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
    if (authors) {
      authors.forEach((author) => {
        fetchPosts(author);
        console.log("test");
      });
    }
  }, [authors]);

  return (
    <>
      <h1>HomeFeed</h1>
      <p>{authors}</p>
    </>
  );
};

export default HomeFeed;
