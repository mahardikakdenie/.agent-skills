import React from 'react';

import { Box } from '@repo/ui';

import OptimizeImage from './image';

interface ImageOrDefaultProps {
  onClick?: () => void;
  alt: string;
  src: any;
  additionalClassNameImg?: string;
  additionalClassNameP?: string;
  text?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const ImageOrDefault: React.FC<ImageOrDefaultProps> = ({
  onClick,
  alt,
  src,
  additionalClassNameImg,
  additionalClassNameP,
  text,
  width,
  height,
  priority,
}) => {
  return (
    <Box onClick={onClick} className={onClick && 'cursor-pointer'}>
      {src ? (
        <OptimizeImage
          width={width}
          height={height}
          priority={priority}
          alt={alt}
          src={src}
          className={additionalClassNameImg}
        />
      ) : (
        <Box
          as="p"
          className={`text-center text-gray-400 font-semibold text-sm border border-gray-300 rounded-md ${additionalClassNameP}`}
        >
          {text ? text : 'No image available'}
        </Box>
      )}
    </Box>
  );
};

export default ImageOrDefault;
