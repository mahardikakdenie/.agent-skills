const defaultColor = "#000";
const defaultWidth = "24";
const defaultHeight = "24";

const UploadIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                stroke={color ? color : defaultColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke={color ? color : defaultColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3V15" stroke={color ? color : defaultColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default UploadIcon;