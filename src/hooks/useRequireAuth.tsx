import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
const useRequireAuth = () => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const isToken = await getCookie("token");
      if (!isToken) {
        router.push("/");
      }
    };
    check().then();
  }, [state.isAuthenticated, router]);
};

export default useRequireAuth;
