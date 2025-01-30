const defaultColor = "#016DA1";
const defaultWidth = "10";
const defaultHeight = "70";

const JourneyVertical = (
  color?: string,
  width?: string,
  height?: string,
  viewBox?: string
) => {
  return (
    <svg
      width={width ? width : defaultWidth}
      height={height ? height : defaultHeight}
      viewBox={
        viewBox
          ? viewBox
          : `0 0 ${width ? width : defaultWidth} ${
              height ? height : defaultHeight
            }`
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="4.5"
        y1="2.18557e-08"
        x2="4.5"
        y2="70"
        stroke={color ? color : defaultColor}
        strokeDasharray="2 2"
        className="min-w-[10px]"
      />
      <circle cx="5" cy="35" r="5" fill={color ? color : defaultColor} />
    </svg>
  );
};

export default JourneyVertical;
