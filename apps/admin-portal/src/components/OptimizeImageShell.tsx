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
  layout?: string;
  renderImage: (props: {
    onClick?: () => void;
    alt: string;
    src: any;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    priority?: boolean;
    layout?: string;
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
  layout = undefined,
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
        layout,
      })}
    </>
  );
};

export default OptimizeImageShell;
