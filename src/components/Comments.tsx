import { useEffect, useState } from "react";

import Comment from "./Comment";

type comment = {
  postid: string;
  author: { _id: string; username: string };
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string; // comment id
};

interface Props {
  comments: comment[] | null;
  postAuthorId: string;
}

const Comments = (props: Props) => {
  const [comments, setComments] = useState<comment[] | null>(null);

  useEffect(() => {
    setComments(props.comments);
  }, [props.comments]);
  return (
    <>
      {comments
        ? comments.map((comment) => (
            <Comment
              key={comment._id}
              postid={comment.postid}
              postAuthorId={props.postAuthorId}
              authorid={comment.author._id}
              username={comment.author.username}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
              text={comment.text}
              commentid={comment._id}
            />
          ))
        : null}
    </>
  );
};

export default Comments;
