const defaultColor = "#000";
const defaultWidth = "16";
const defaultHeight = "16";

const ChecklistIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_4438_20386)">
                <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_4438_20386">
                    <rect width="16" height="16" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}

export default ChecklistIcon;