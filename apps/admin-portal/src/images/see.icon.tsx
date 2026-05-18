import { Box } from '@repo/ui';

const defaultColor = '#000';
const defaultWidth = '21';
const defaultHeight = '20';

const SeeIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
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
      <Box as="g" clipPath="url(#clip0_5932_37561)">
        <Box
          as="path"
          d="M1.3335 10.0007C1.3335 10.0007 4.66683 3.33398 10.5002 3.33398C16.3335 3.33398 19.6668 10.0007 19.6668 10.0007C19.6668 10.0007 16.3335 16.6673 10.5002 16.6673C4.66683 16.6673 1.3335 10.0007 1.3335 10.0007Z"
          stroke={color ? color : defaultColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Box
          as="path"
          d="M10.5 12.5C11.8807 12.5 13 11.3807 13 10C13 8.61929 11.8807 7.5 10.5 7.5C9.11929 7.5 8 8.61929 8 10C8 11.3807 9.11929 12.5 10.5 12.5Z"
          stroke={color ? color : defaultColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
      <Box as="defs">
        <Box as="clipPath" id="clip0_5932_37561">
          <Box as="rect" width="20" height="20" fill="white" transform="translate(0.5)" />
        </Box>
      </Box>
    </Box>
  );
};

export default SeeIcon;
