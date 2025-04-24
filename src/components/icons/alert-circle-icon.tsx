const defaultColor = "#F5BA41";
const defaultWidth = "24";
const defaultHeight = "24";

const AlertCircleIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
  return (
    <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V12" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16H12.01" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default AlertCircleIcon;