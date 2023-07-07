import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const Profile = () => {
  const { username } = useParams();
  console.log(username);
  return (
    <>
      <Navbar />
      <h1>Profile Page</h1>
    </>
  );
};

export default Profile;
