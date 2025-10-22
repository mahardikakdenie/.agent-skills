const defaultColor = "#111";
const defaultWidth = "16";
const defaultHeight = "17";

const DownloadIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2757_1681)">
                <path
                    d="M14 10.5V13.1667C14 13.5203 13.8595 13.8594 13.6095 14.1095C13.3594 14.3595 13.0203 14.5 12.6667 14.5H3.33333C2.97971 14.5 2.64057 14.3595 2.39052 14.1095C2.14048 13.8594 2 13.5203 2 13.1667V10.5"
                    stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.66699 7.1665L8.00033 10.4998L11.3337 7.1665" stroke={color ? color : defaultColor} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10.5V2.5" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_2757_1681">
                    <rect width={width ? width : defaultWidth} height={width ? width : defaultWidth} fill="white" transform="translate(0 0.5)"/>
                </clipPath>
            </defs>
        </svg>
    );
}

export default DownloadIcon;