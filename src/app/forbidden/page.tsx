"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import forbiddenPage from "/public/images/access-denied.png";
import forbiddenDescription from "/public/images/unauthorized-access-description.png";
import Image from "next/image";

const ForbiddenPage = () => {
  useRequireAuth();

  return (
    <div className="flex flex-col w-full">

      <div
        className="w-full text-black-700 text-left p-3 pl-6 font-bold"
        style={{ backgroundColor: "#DDB8B8" }}
      >
        Unauthorized Access
      </div>

      <div className="w-full p-6 m-2 bg-white rounded flex flex-col justify-center items-center gap-6 frame-body">
        <div className="flex justify-center">
          <Image
            alt="403 - Forbidden"
            src={forbiddenPage}
            width={400}
            className="max-w-full"
          />
        </div>
        <div className="flex justify-center">
          <Image
            alt="403 - Forbidden"
            src={forbiddenDescription}
            width={400}
            className="max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

const ForbiddenPageWithSidebar = (params: any) => WithSidebar(ForbiddenPage)(params);
export default ForbiddenPageWithSidebar;
