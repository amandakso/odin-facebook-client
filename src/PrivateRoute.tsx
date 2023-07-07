import { Navigate } from "react-router-dom";

type childType = {
  child: JSX.Element;
};

const PrivateRoute = ({ child }: childType) => {
  const isLoggedIn = sessionStorage.getItem("token") ? true : false;

  if (isLoggedIn) {
    return child;
  }
  return <Navigate replace={true} to="/login" />;
};

export default PrivateRoute;
