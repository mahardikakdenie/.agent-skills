import { Box } from '@repo/ui';

const defaultColor = '#000';
const defaultWidth = '24';
const defaultHeight = '24';

const XIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
  return (
    <Box
      as="svg"
      width={width ? width : defaultWidth}
      height={height ? height : defaultHeight}
      viewBox={
        viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Box
        as="path"
        d="M18 6L6 18"
        stroke={color ? color : defaultColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Box
        as="path"
        d="M6 6L18 18"
        stroke={color ? color : defaultColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
};

export default XIcon;
