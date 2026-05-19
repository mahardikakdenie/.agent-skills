import AppURL from "@/constants/app-url.const";
import Revenue2Icon from "@/components/core/revenue-2.icon";
import GlobeLocation2Icon from "@/components/core/globe-location-2.icon";
import HamburgerIcon from "@/components/core/hamburger.icon";
import CommissionIcon from "@/components/core/commission.icon";
import SecureDoc2Icon from "@/components/core/secure-doc-2.icon";
import friendsureLogo from "@public/friendsure-logo.svg";

const getSimpleNumber = (val: number) => {
    if (val >= 1_000_000_000) {
        return (val / 1_000_000_000).toFixed(1) + "B";
    } else if (val >= 1_000_000) {
        return (val / 1_000_000).toFixed(1) + "M";
    } else if (val >= 1_000) {
        return (val / 1_000).toFixed(1) + "K";
    }
    return val;
}

export const AUTH_TOKEN = "token";

export const REFRESH_TOKEN = "refresh_token";

export const delimiter = ";;;";

export const minWidthContainer = 640;

export const primary10 = process.env.NEXT_PUBLIC_PRIMARY_10 || "#F3FBFF";

export const primary20 = process.env.NEXT_PUBLIC_PRIMARY_20 || "#CCE2EC";

export const primary30 = process.env.NEXT_PUBLIC_PRIMARY_30 || "#5ED1B1";

export const primary40 = process.env.NEXT_PUBLIC_PRIMARY_40 || "#76CAFF";

export const primary50 = process.env.NEXT_PUBLIC_PRIMARY_50 || "#009DFF";

export const primary = process.env.NEXT_PUBLIC_PRIMARY_BASE || "#016DA1";

export const primaryYellow = "#F5BA41";

export const primaryYellowLightForeground = "#FFFEE2";

export const primaryRed = "#E83F3F";

export const primaryRedLightForeground = "#FFF5F5";

export const primaryDisabled = "#D1D5DB";

export const iconMenuGradient = process.env.NEXT_PUBLIC_ICON_MENU_ROUND_GRADIENT || "#0E83C9,#1C92D1,#30A8DD,#3EB8E6,#47C1EB,#4AC4ED";

export const logoWidth = Number(process.env.NEXT_PUBLIC_LOGO_WIDTH) || undefined;

export const logoHeight = Number(process.env.NEXT_PUBLIC_LOGO_HEIGHT) || undefined;

export const logo = process.env.NEXT_PUBLIC_LOGO || friendsureLogo;

export const ssoMode = process.env.NEXT_PUBLIC_MODE ? `&mode=${encodeURIComponent(process.env.NEXT_PUBLIC_MODE)}` : "&mode=";

export const backgroundImageApp = process.env.NEXT_PUBLIC_BACKGROUND || "url('/friendsure-background.svg')";

export const templateFileLink: { [key: string]: string } = {
    personalAccidentPackages: "",
    personalAccidentBenefits: "",
    personalAccidentDetails: "",
    travelPackages: "",
    travelBenefits: "",
    travelDetails: "",
    airpazPackages: "",
    airpazBenefits: "",
    airpazDetails: "",
    motorCarPackages: "",
    motorCarBenefits: "",
    motorCarDetails: "",
    motorCyclePackages: "",
    motorCycleBenefits: "",
    motorCycleDetails: "",
    gadgetPackages: "",
    gadgetBenefits: "",
    gadgetDetails: ""
};

export const slaStatus = ["On Track", "Due Date", "Overdue"];

export const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const transactionType = ["Conventional", "Online"];

export const transactionStatus = [
    {
        name: "Declaration",
        color: primary
    },
    {
        name: "Paid",
        color: "#00AB4F"
    },
    {
        name: "Pending",
        color: primaryYellow
    },
    {
        name: "Draft",
        color: "#000"
    }
];

export const policyStatus: any[] = [
    {
        name: "Pending",
        color: primary
    },
    {
        name: "In Force",
        color: primary
    },
    {
        name: "Grace Period",
        color: primaryYellow
    },
    {
        name: "Expired",
        color: "#939597"
    }
];

export const defaultOptionPagination: any[] = [
    {
        label: "5",
        value: 5
    },
    {
        label: "10",
        value: 10
    },
    {
        label: "25",
        value: 25
    },
    {
        label: "50",
        value: 50
    },
    {
        label: "100",
        value: 100
    }
];

export const homeCard: any[] = [
    {
        icon: Revenue2Icon(primary, "35", "54", "0 0 41 41"),
        url: AppURL.transactionRevenue,
        name: "Revenue",
        description: "Total Revenue",
        color: primary,
        type: []
    },
    {
        icon: GlobeLocation2Icon(primary, "35", "54", "0 0 41 41"),
        url: AppURL.transactionCountries,
        name: "Countries",
        description: "Total Countries",
        color: primary,
        type: []
    },
    {
        icon: HamburgerIcon(primary, "35", "54", "0 -8 41 41"),
        url: AppURL.policyList,
        name: "Policies",
        description: "Total Policies",
        color: primary,
        type: []
    },
    {
        icon: SecureDoc2Icon(primary, "35", "54", "10 8 40 40"),
        url: AppURL.claimList,
        name: "Claims",
        description: "Total Claims",
        color: primaryYellow,
        type: [
            {
                name: "Number of claim",
                color: primary50,
            },
            {
                name: "Amount approved of claim",
                color: primary,
            }
        ]
    },
    {
        icon: CommissionIcon(primary, "35", "54", "0 0 30 30"),
        url: AppURL.claimList,
        name: "Claim Value",
        description: "Total Claim Value",
        color: primaryYellow,
        type: []
    }
];

export const defaultChart: any = {
    stringLabel: "Total",
    monthsLabel: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    zeroDataChart: {
        labels: ["Data"],
        datasets: [
            {
                label: "Data",
                data: [1],
                backgroundColor: [primary],
                borderColor: [primary],
                borderWidth: 1,
            },
        ],
    },
    zeroOptionsChart: {
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                display: true,
                position: "right",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 10,
                    },
                },
            }
        }
    },
    dataEmpty: {
        labels: ["Blue", "Red", "Yellow"],
        datasets: [
            {
                label: "Total",
                data: [70, 20, 10],
                backgroundColor: [
                    primary,
                    primaryRed,
                    primaryYellow,
                ],
                borderColor: [
                    primary,
                    primaryRed,
                    primaryYellow,
                ],
                borderWidth: 1,
            },
        ],
    },
    data1Empty: {
        labels: [ "Year" ],
        datasets: [
            {
                label: "Blue",
                data: [5],
                backgroundColor: primary,
                borderColor: primary,
                borderWidth: 1,
            },
            {
                label: "Red",
                data: [10],
                backgroundColor: primaryRed,
                borderColor: primaryRed,
                borderWidth: 1,
            },
            {
                label: "Yellow",
                data: [8],
                backgroundColor: primaryYellow,
                borderColor: primaryYellow,
                borderWidth: 1,
            },
        ],
    },
    data2Empty: {
        labels: [ "Jan", "Feb", "Mar", "Apr" ],
        datasets: [
            {
                label: "Blue",
                data: [10, 7, 12, 11],
                backgroundColor: primary,
                borderColor: primary,
                borderWidth: 1,
            },
            {
                label: "Red",
                data: [8, 5, 10, 9],
                backgroundColor: primaryRed,
                borderColor: primaryRed,
                borderWidth: 1,
            },
            {
                label: "Yellow",
                data: [6, 3, 8, 7],
                backgroundColor: primaryYellow,
                borderColor: primaryYellow,
                borderWidth: 1,
            }
        ]
    },
    optionsEmpty: {
        plugins: {
            legend: {
                display: false
            }
        }
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 10,
                    },
                },
            }
        }
    },
    options1Empty: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false,
                beginAtZero: true
            }
        }
    },
    options1: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "bottom" as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 10,
                    },
                },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: getSimpleNumber
                }
            }
        }
    }
};
