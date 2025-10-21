import {primary} from "@/constants/app-common.const";

const defaultColor = primary;
const defaultWidth = "32";
const defaultHeight = "33";

const HomeIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23.0725 14.2256L20.4458 11.599L20.4458 6.92431C20.4458 6.53719 20.1321 6.22406 19.7456 6.22406L18.243 6.22406C17.8559 6.22406 17.5427 6.53777 17.5427 6.92431L17.5427 8.69588L15.1351 6.2883C14.8725 6.02563 14.4074 6.02563 14.1447 6.2883L6.20564 14.2257C5.97796 14.4533 5.93151 14.8124 6.10815 15.0951C6.23834 15.3033 6.47462 15.4214 6.72066 15.4214L7.3951 15.4214L7.39511 21.5023C7.39511 21.8275 7.65892 22.0913 7.9841 22.0913L11.7578 22.0913C12.083 22.0913 12.3468 21.8275 12.3468 21.5023L12.3468 15.7231C12.3468 15.336 12.6605 15.0228 13.047 15.0228L16.2311 15.0228C16.6182 15.0228 16.9314 15.3365 16.9314 15.7231L16.9314 21.5023C16.9314 21.8275 17.1952 22.0913 17.5204 22.0913L21.2946 22.0913C21.6198 22.0913 21.8836 21.8275 21.8836 21.5023L21.8836 15.4214L22.5776 15.4214C22.8609 15.4214 23.1161 15.2505 23.2251 14.989C23.3334 14.7269 23.2732 14.4258 23.0731 14.2256L23.0725 14.2256Z"
                fill={color ? color : defaultColor}/>
        </svg>
    );
}

export default HomeIcon;