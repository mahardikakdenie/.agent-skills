import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
const useRequireAuth = () => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const isToken = await getCookie("token");
      if (!isToken) {
        router.push("/");
      }
    };
    check().then();
  }, [state.isAuthenticated, router]);
};

export default useRequireAuth;
