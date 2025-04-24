import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

const useRequireAuth = () => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.token === null) {
      router.replace("/");
    }
  }, [state.token, router]);
};

export default useRequireAuth;
