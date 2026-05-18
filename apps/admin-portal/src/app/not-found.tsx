import React from 'react';

import { Box } from '@repo/ui';

const PageNotFound: React.FC = () => {
  return (
    <Box className="h-[calc(100vh-50px)] flex flex-col items-center justify-center">
      <Box as="h1" className="font-bold text-3xl">
        404 - Page Not Found
      </Box>
      <Box as="p" className="mx-5 text-center">
        Oops! The page you are looking for does not exist.
      </Box>
    </Box>
  );
};

export default PageNotFound;
