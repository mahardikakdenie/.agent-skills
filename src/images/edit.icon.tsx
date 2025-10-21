const defaultColor = "#000";
const defaultWidth = "20";
const defaultHeight = "20";

const EditIcon = (color?: string, width?: string, height?: string, viewBox?: string) => {
    return (
        <svg width={width ? width : defaultWidth} height={height ? height : defaultHeight} viewBox={viewBox ? viewBox : `0 0 ${width ? width : defaultWidth} ${height ? height : defaultHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5486_14634)">
                <path
                    d="M16.667 12.2173V16.6673C16.667 17.1093 16.4914 17.5333 16.1788 17.8458C15.8663 18.1584 15.4424 18.334 15.0003 18.334H3.33366C2.89163 18.334 2.46771 18.1584 2.15515 17.8458C1.84259 17.5333 1.66699 17.1093 1.66699 16.6673V5.00065C1.66699 4.55862 1.84259 4.1347 2.15515 3.82214C2.46771 3.50958 2.89163 3.33398 3.33366 3.33398H7.78366"
                    stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.0003 1.66602L18.3337 4.99935L10.0003 13.3327H6.66699V9.99935L15.0003 1.66602Z"
                      stroke={color ? color : defaultColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_5486_14634">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}

export default EditIcon;