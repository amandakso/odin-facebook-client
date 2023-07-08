import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  console.log(username);
  return (
    <>
      <h1>Profile Page</h1>
    </>
  );
};

export default Profile;
