"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";

const HomePage = () => {
  useRequireAuth();

  return <div className="w-full p-6 m-2 bg-white rounded shadow-md"></div>;
};
const HomePageWithSidebar = (params: any) => WithSidebar(HomePage)(params);
export default HomePageWithSidebar;
