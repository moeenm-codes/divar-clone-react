import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "services/user";
import { getCookie } from "utils/cookie";
import Loader from "components/modules/Loader";

const AuthRedirect = ({ children }) => {
  const hasToken = !!getCookie("accessToken");

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (!hasToken) {
    return children;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRedirect;
