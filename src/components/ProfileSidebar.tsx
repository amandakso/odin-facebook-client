import Button from "@mui/material/Button";

const ProfileSidebar = (props): JSX.Element => {
  return (
    <>
      <div>status: {props.status}</div>
      <div>id: {props.profileId}</div>
      <div>PROFILE IMG PLACEHOLDER</div>
      <div>FRIENDS LIST PLACEHOLDER</div>
      <Button variant="contained">ADD FRIEND</Button>
    </>
  );
};

export default ProfileSidebar;
