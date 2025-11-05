import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "services/user";
import Loader from "components/modules/Loader";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) return <Loader />;

  const isLoggedIn = !!data;
  const isAdmin = data?.data?.role === "ADMIN";

  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
