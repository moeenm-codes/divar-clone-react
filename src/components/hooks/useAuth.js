// src/components/hooks/useAuth.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "services/user";
import { removeTokens } from "utils/cookie";

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    cacheTime: 10 * 60 * 1000,
  });

  const user = data?.data;

  const logout = () => {
    removeTokens();
    queryClient.removeQueries(["profile"]); // پاک کردن کش
    window.location.href = "/"; // یا navigate("/")
  };

  return { user, isLoading, logout };
};

export { useAuth };
