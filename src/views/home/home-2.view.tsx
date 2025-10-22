import React from "react";
import { usePathname } from "next/navigation";
import { useScreen } from "@/context/screen.context";
import { getHeaderPage } from "@/helpers/app.helper";

export const Home2View = () => {
  const path = usePathname();
  const { isMobileView } = useScreen();

  return (
    <div className="mx-auto py-5 px-7">
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-lg">
          {getHeaderPage(2, path, true).pageName}
        </p>
      </div>
      <iframe
        width="100%"
        className="overflow-y-auto sm:scrollable"
        src="https://lookerstudio.google.com/embed/reporting/7650d195-9151-4f9d-bbc9-bc60a8ead914/page/3ORcE"
        style={{ border: 0, minHeight: isMobileView ? "40vh" : "120vh" }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};
