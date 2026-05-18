import React, { CSSProperties } from "react";

interface OptimizeImageShellProps {
  onClick?: () => void;
  alt: string;
  src: any;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  renderImage: (props: {
    onClick?: () => void;
    alt: string;
    src: any;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    priority?: boolean;
  }) => React.ReactNode;
}

const OptimizeImageShell: React.FC<OptimizeImageShellProps> = ({
  onClick,
  alt,
  src,
  width,
  height,
  className,
  style,
  priority = false,
  renderImage,
}) => {
  return (
    <>
      {renderImage({
        onClick,
        alt,
        src,
        width,
        height,
        className,
        style,
        priority,
      })}
    </>
  );
};

export default OptimizeImageShell;
