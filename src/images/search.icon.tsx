import {primary} from "@/constants/app-common.const";

const defaultColor = primary;
const defaultWidth = "24";
const defaultHeight = "24";

const SearchIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M10 18C11.846 18 13.543 17.365 14.897 16.312L19.293 20.708L20.707 19.294L16.311 14.898C17.365 13.543 18 11.846 18 10C18 5.589 14.411 2 10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18ZM10.0001 4.00003C13.3091 4.00003 16.0001 6.69103 16.0001 10C16.0001 13.309 13.3091 16 10.0001 16C6.69106 16 4.00006 13.309 4.00006 10C4.00006 6.69103 6.69106 4.00003 10.0001 4.00003Z"
                  fill={color ? color : defaultColor}/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M11.4118 8.58609C11.7908 8.96609 11.9998 9.46809 11.9998 10.0001H13.9998C13.9998 8.93509 13.5838 7.93109 12.8258 7.17209C11.3118 5.66009 8.68683 5.66009 7.17383 7.17209L8.58583 8.58809C9.34583 7.83009 10.6558 7.83209 11.4118 8.58609Z"
                  fill={color ? color : defaultColor}/>
        </svg>
    );
}

export default SearchIcon;