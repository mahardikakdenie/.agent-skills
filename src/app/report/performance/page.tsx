"use client";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useEffect } from "react";

export default function LookerReport() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://looker.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Report</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Performance Report</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
          Performance Report
        </h2>
      </div>
      <div className="flex justify-center items-center pb-6">
        <iframe
          src="https://lookerstudio.google.com/embed/reporting/3a73fa39-1e33-41ab-ba62-9e307977beee/page/3ORcE"
          width="100%"
          height="800px"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};