const defaultColor = "#000";
const defaultWidth = "16";
const defaultHeight = "16";

const AddIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.3335V12.6668" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M3.33325 8H12.6666" stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    );
}

export default AddIcon;