import Post from "./Post";

const Posts = (props): JSX.Element => {
  const arr = props.posts;

  return (
    <>
      {arr
        ? arr.map((post) => (
            <Post
              key={post._id}
              authorid={post.author._id}
              username={post.author.username}
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
