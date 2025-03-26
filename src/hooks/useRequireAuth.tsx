import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { getGlobalToken } from "@/lib/token-storage";

const useRequireAuth = () => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const isToken = getGlobalToken();
      if (!isToken) {
        router.push("/");
      }
    };

    checkAuth();
  }, [state.token, router]);
};

export default useRequireAuth;
