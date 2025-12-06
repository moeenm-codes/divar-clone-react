import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "services/user";
import { getCookie } from "utils/cookie";
import Loader from "components/modules/Loader";

function ProtectedRoute({ children, requireAdmin = false }) {
  const hasToken = !!getCookie("accessToken");

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (!hasToken) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <Navigate to="/auth" replace />;
  }

  const isAdmin = data?.data?.role === "ADMIN";

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
