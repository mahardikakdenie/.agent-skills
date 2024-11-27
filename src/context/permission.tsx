import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { hasPermission, useAuth } from "./auth.context";

interface WithPermissionProps {
  requiredPermission: string;
}

const withPermission = (WrappedComponent: React.ComponentType<any>, requiredPermission: string) => {
    const ProtectedComponent = (props: any) => {
      const { claims } = useAuth();
      const router = useRouter();
  
      // State to check if the component has mounted on the client
      const [isMounted, setIsMounted] = useState(false);
  
      useEffect(() => {
        // Set isMounted to true after the component mounts on the client
        setIsMounted(true);
      }, []);
  
      useEffect(() => {
        // Run permission checks only after the component has mounted
        if (isMounted) {
          if (!claims) {
            router.push("/login");
            return;
          }
  
          if (!hasPermission(claims, requiredPermission)) {
            router.push("/403");
            return;
          }
        }
      }, [claims, requiredPermission, isMounted, router]);
  
      // Prevent rendering until the component is mounted on the client
      if (!isMounted) {
        return null; // Don't render anything while waiting for client-side mounting
      }
  
      if (!claims || !hasPermission(claims, requiredPermission)) {
        return <p>Loading...</p>; // Show loading state until permission check is done
      }
  
      return <WrappedComponent {...props} />;
    };
  
    return ProtectedComponent;
  };
  
  export default withPermission;