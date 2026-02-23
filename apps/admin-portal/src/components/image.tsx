import React, { CSSProperties } from "react";
import Image from "next/image";
import OptimizeImageShell from "./OptimizeImageShell";

interface ImageProps {
  onClick?: () => void;
  alt: string;
  src: any;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  layout?: string;
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
  layout = undefined,
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
      layout={layout}
      renderImage={(imageProps) => <Image {...imageProps} />}
    />
  );
};

export default OptimizeImage;
