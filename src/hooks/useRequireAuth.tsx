import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/constants/routes";

const useRequireAuth = () => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.token === null) {
      router.replace(LOGIN);
    }
  }, [state.token, router]);
};

export default useRequireAuth;
