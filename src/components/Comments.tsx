import { useEffect, useState } from "react";

type comment = {
  postid: string;
  author: { _id: string; username: string };
  text: string;
  createdAt: string;
  updated: string;
  __v: number;
  _id: string; // comment id
};

const Comments = () => {
  const [comments, setComments] = useState<comment[] | null>(null);

  return (
    <>
      <h1>Comments</h1>
    </>
  );
};

export default Comments;
