'use client';

import { useEffect } from 'react';

import {
  Box,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@repo/ui';

export default function LookerReport() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://looker.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box className="flex w-full flex-col">
      <Box className="flex items-center bg-white p-4 md:px-6">
        <Box>
          <Breadcrumb className="hidden sm:block">
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
          <Box as="h2" className="text-lg font-bold text-black sm:mt-2 sm:text-2xl">
            Performance Report
          </Box>
        </Box>
      </Box>
      <Box className="flex items-center justify-center p-6">
        <Box
          as="iframe"
          src="https://lookerstudio.google.com/embed/reporting/3a73fa39-1e33-41ab-ba62-9e307977beee/page/3ORcE"
          width="100%"
          height="800px"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      </Box>
    </Box>
  );
}
