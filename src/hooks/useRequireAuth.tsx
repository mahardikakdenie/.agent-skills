import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
const useRequireAuth = () => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/");
    }
  }, [state.isAuthenticated, router]);
};

export default useRequireAuth;
