import { Box } from '@repo/ui';

import { iconMenuGradient } from '@/constants/app-common.const';

const defaultGradientColor = iconMenuGradient.split(',');
const defaultWidth = '26';
const defaultHeight = '26';

const CircleMenuIcon = (
  gradientColor?: string[],
  width?: string,
  height?: string,
  viewBox?: string,
) => {
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
        d="M13.0008 25.7496C19.9172 25.7496 25.5241 20.1428 25.5241 13.2263C25.5241 6.30994 19.9172 0.703098 13.0008 0.703107C6.08439 0.703117 0.477547 6.30998 0.477557 13.2264C0.477566 20.1428 6.08443 25.7496 13.0008 25.7496Z"
        fill="url(#paint0_linear_3925_4747)"
      />
      <Box as="defs">
        <Box
          as="linearGradient"
          id="paint0_linear_3925_4747"
          x1="0.477557"
          y1="13.2264"
          x2="25.5241"
          y2="13.2263"
          gradientUnits="userSpaceOnUse"
        >
          <Box as="stop" stopColor={gradientColor ? gradientColor[0] : defaultGradientColor[0]} />
          <Box
            as="stop"
            offset="0.1"
            stopColor={gradientColor ? gradientColor[1] : defaultGradientColor[1]}
          />
          <Box
            as="stop"
            offset="0.27"
            stopColor={gradientColor ? gradientColor[2] : defaultGradientColor[2]}
          />
          <Box
            as="stop"
            offset="0.46"
            stopColor={gradientColor ? gradientColor[3] : defaultGradientColor[3]}
          />
          <Box
            as="stop"
            offset="0.68"
            stopColor={gradientColor ? gradientColor[4] : defaultGradientColor[4]}
          />
          <Box
            as="stop"
            offset="1"
            stopColor={gradientColor ? gradientColor[5] : defaultGradientColor[5]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CircleMenuIcon;
