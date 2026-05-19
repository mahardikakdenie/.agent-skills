import { Box } from '@repo/ui';

const defaultColor = '#000';
const defaultWidth = '34';
const defaultHeight = '26';

const HamburgerIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
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
        d="M6.4834 1.5625L27.5169 1.56247"
        stroke={color ? color : defaultColor}
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <Box
        as="path"
        d="M6.4834 16.8125L27.5169 16.8125"
        stroke={color ? color : defaultColor}
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <Box
        as="path"
        d="M6.4834 24.4385L27.5169 24.4384"
        stroke={color ? color : defaultColor}
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <Box
        as="path"
        d="M1.80664 9.18848L32.1923 9.18843"
        stroke={color ? color : defaultColor}
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </Box>
  );
};

export default HamburgerIcon;
