import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <>
      <h1>Page Not Found</h1>
      <p>
        Return to Home Page <Link to="/odin-facebook-client/">HERE</Link>
      </p>
    </>
  );
};

export default NotFound;
