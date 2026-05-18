import React, { CSSProperties } from "react";
import Image from "next/image";
import OptimizeImageShell from "./optimize-image-shell";

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
    <OptimizeImageShell
      onClick={onClick}
      alt={alt}
      src={src}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      renderImage={(imageProps) => <Image {...imageProps} />}
    />
  );
};

export default OptimizeImage;
