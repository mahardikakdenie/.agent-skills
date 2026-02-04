import {primary} from "@/constants/app-common.const";

const defaultColor = primary;
const defaultWidth = "24";
const defaultHeight = "24";

const WifiOffIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_3317_40357)">
                <path d="M1 1L23 23" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.7202 11.06C17.5393 11.4597 18.3053 11.9603 19.0002 12.55" stroke={color ? color : defaultColor} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12.55C6.48208 11.3108 8.26587 10.4862 10.17 10.16" stroke={color ? color : defaultColor} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M10.71 5.05001C12.8524 4.87738 15.0076 5.13818 17.047 5.81683C19.0864 6.49549 20.9682 7.57809 22.58 9.00001"
                    stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.41992 9C2.80709 7.77385 4.39762 6.79922 6.11992 6.12" stroke={color ? color : defaultColor} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M8.52979 16.11C9.54499 15.3887 10.7595 15.0013 12.0048 15.0013C13.2501 15.0013 14.4646 15.3887 15.4798 16.11"
                    stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20H12.01" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_3317_40357">
                    <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}

export default WifiOffIcon;