"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";

const ForbiddenPage = () => {
  useRequireAuth();

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="w-full p-6 m-2 bg-white rounded flex flex-col justify-center items-center gap-3 frame-body">
        <h1 className="text-xl font-bold text-red-500">403 - Forbidden</h1>
        <p className="text-center text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

const ForbiddenPageWithSidebar = (params: any) => WithSidebar(ForbiddenPage)(params);
export default ForbiddenPageWithSidebar;
