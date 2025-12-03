// components/AuthRedirect.jsx
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "services/user";
import Loader from "components/modules/Loader";

const AuthRedirect = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) return <Loader />;

  if (data) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRedirect;
