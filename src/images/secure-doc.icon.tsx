import {primary, primaryRed} from "@/constants/app-common.const";

const defaultColor = primary;
const defaultColor2 = primaryRed;
const defaultColorRect = "#FFF";
const defaultWidth = "54";
const defaultHeight = "54";
const defaultWidthRect = "42";
const defaultHeightRect = "42";

const SecureDocIcon = (color?: string, color2?: string, width?: string, height?: string, colorRect?: string, widthRect?: string, heightRect?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2921_562)">
                <path
                    d="M37.5 48.0001C37.325 48.0001 37.15 47.9651 36.9855 47.8951C36.5795 47.7218 27 43.5498 27 34.9696V27.9381C27 27.3763 27.357 26.8776 27.8907 26.6956L37.0783 23.5701C37.3513 23.4773 37.6487 23.4773 37.9217 23.5701L47.1092 26.6956C47.643 26.8776 48 27.3763 48 27.9381V34.9696C48 43.5498 38.4205 47.7218 38.0145 47.8968C37.85 47.9651 37.675 48.0001 37.5 48.0001ZM29.625 28.8778V34.9678C29.625 40.8006 35.673 44.3076 37.5 45.2316C39.327 44.3076 45.375 40.8006 45.375 34.9678V28.8778L37.5 26.1986L29.625 28.8778Z"
                    fill={color ? color : defaultColor}/>
                <path
                    d="M37.0626 40.1251C36.7161 40.1251 36.38 39.9886 36.135 39.7401L32.6351 36.2401C32.1223 35.7274 32.1223 34.8961 32.6351 34.3834C33.1478 33.8706 33.9791 33.8706 34.4918 34.3834L36.9226 36.8141L41.2626 31.0251C41.6931 30.4459 42.5191 30.3269 43.1001 30.7644C43.6793 31.1984 43.7966 32.0209 43.3608 32.6019L38.1108 39.6019C37.8833 39.9064 37.5351 40.0954 37.1536 40.1234C37.1238 40.1234 37.0941 40.1251 37.0626 40.1251Z"
                    fill={color2 ? color2 : defaultColor2}/>
                <path
                    d="M24.5325 42.75H10.8125C8.15775 42.75 6 40.5923 6 37.9375V10.8125C6 8.15775 8.15775 6 10.8125 6H30.9375C33.5923 6 35.75 8.15775 35.75 10.8125V20.315C35.75 21.0395 35.162 21.6275 34.4375 21.6275C33.713 21.6275 33.125 21.0395 33.125 20.315V10.8125C33.125 9.60675 32.1432 8.625 30.9375 8.625H10.8125C9.60675 8.625 8.625 9.60675 8.625 10.8125V37.9375C8.625 39.1432 9.60675 40.125 10.8125 40.125H24.5325C25.257 40.125 25.845 40.713 25.845 41.4375C25.845 42.162 25.257 42.75 24.5325 42.75Z"
                    fill={color ? color : defaultColor}/>
                <path
                    d="M29.1875 22.625H12.5625C11.838 22.625 11.25 22.037 11.25 21.3125C11.25 20.588 11.838 20 12.5625 20H29.1875C29.912 20 30.5 20.588 30.5 21.3125C30.5 22.037 29.912 22.625 29.1875 22.625Z"
                    fill={color2 ? color2 : defaultColor2}/>
                <path
                    d="M22.1875 29.625H12.5625C11.838 29.625 11.25 29.037 11.25 28.3125C11.25 27.588 11.838 27 12.5625 27H22.1875C22.912 27 23.5 27.588 23.5 28.3125C23.5 29.037 22.912 29.625 22.1875 29.625Z"
                    fill={color2 ? color2 : defaultColor2}/>
                <path
                    d="M20.4375 15.625H12.5625C11.838 15.625 11.25 15.037 11.25 14.3125C11.25 13.588 11.838 13 12.5625 13H20.4375C21.162 13 21.75 13.588 21.75 14.3125C21.75 15.037 21.162 15.625 20.4375 15.625Z"
                    fill={color2 ? color2 : defaultColor2}/>
            </g>
            <defs>
                <clipPath id="clip0_2921_562">
                    <rect width={widthRect ? widthRect : defaultWidthRect} height={heightRect ? heightRect : defaultHeightRect} fill={colorRect ? colorRect : defaultColorRect} transform="translate(6 6)"/>
                </clipPath>
            </defs>
        </svg>
    );
}

export default SecureDocIcon;