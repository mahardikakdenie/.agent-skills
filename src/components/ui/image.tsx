import React, { CSSProperties } from "react";
import Image from "next/image";

interface ImageProps {
  onClick?: () => void;
  alt: string;
  src: any;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}

const OptimizeImage: React.FC<ImageProps> = ({
  onClick,
  alt,
  src,
  width,
  height,
  className,
  style,
  priority = false,
}) => {
  return (
    <Image
      onClick={onClick}
      alt={alt}
      src={src}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
    />
  );
};

export default OptimizeImage;
