import Post from "./Post";
import { useEffect, useMemo, useState } from "react";

//import Button from "@mui/material/Button";

type post = {
  author: { _id: string; username: string };
  createdAt: string; // date
  text: string;
  updatedAt: string; // date
  __v: number;
  _id: string; //postid
};

const Posts = (props): JSX.Element => {
  const [posts, setPosts] = useState<post[] | null>(null);
  const [numOfPostsShown, setNumOfPostsShown] = useState(5);

  const shownPosts = useMemo(() => {
    return posts
      ?.slice(0, numOfPostsShown)
      .map((post) => (
        <Post
          key={post._id}
          authorid={post.author._id}
          username={post.author.username}
          createdAt={post.createdAt}
          updatedAt={post.updatedAt}
          text={post.text}
          postid={post._id}
        />
      ));
  }, [posts, numOfPostsShown]);

  const showMore = () => {
    if (posts) {
      if (numOfPostsShown + 5 <= posts.length) {
        setNumOfPostsShown(numOfPostsShown + 5);
      } else {
        setNumOfPostsShown(posts.length);
      }
    }
  };
  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);

  return <>{posts ? shownPosts : <p>Loading...</p>}</>;
};

export default Posts;
