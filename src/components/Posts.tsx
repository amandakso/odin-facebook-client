import Post from "./Post";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);
  return (
    <>
      {posts
        ? posts.map((post) => (
            <Post
              key={post._id}
              authorid={post.author._id}
              username={post.author.username}
              //photo={profilePhotos[post.author._id]}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              text={post.text}
              postid={post._id}
            />
          ))
        : null}
    </>
  );
};

export default Posts;
