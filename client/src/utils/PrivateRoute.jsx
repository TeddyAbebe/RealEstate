import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../redux/user/selectors";

export default function PrivateRoute() {
  const { currentUser } = useSelector(selectUser);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
