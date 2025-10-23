import AppMenu from "@/constants/app-menu.const";
import { ChevronRight } from "react-feather";
import { AUTH_TOKEN, monthList, primary, primary10, primary20, primary30, primary40, primary50, primaryRed } from "@/constants/app-common.const";
import toast from "react-hot-toast";
import axios from "axios";
import ApiURL from "@/constants/api-url.const";
import { authToken } from "@/types/auth-token";

export function setCookie(name: string, value: string, days: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
        const url = ApiURL.cookie;

        axios.post(url, { name, value, days })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getCookie(name: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const url = ApiURL.cookieDetails(name);

        axios.get(url)
            .then((response) => {
                if (name === AUTH_TOKEN) authToken.token = response.data.data.value
                resolve(response.data.data.value || null);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function removeCookie(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const url = ApiURL.cookieDetails(name);

        axios.delete(url)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function setLocalStorage(name: string, value: any) {
    localStorage.setItem(name, JSON.stringify(value));
}

export function getLocalStorage(name: string): any {
    const storedValue = localStorage.getItem(name);
    return storedValue ? JSON.parse(storedValue) : null;
}

export function removeAllLocalStorage() {
    localStorage.clear();
}
export const formatMoney = (value:number) => {
    const numericValue = Number(value) || 0;
    return new Intl.NumberFormat("id-ID").format(numericValue);
  };

export const moneyFormatter = (currency: string = "IDR") => {
    try {
        return new Intl.NumberFormat(`en-${currency.substring(0, 2)}`, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    } catch (error: any) {
        return {
            format: (value: number) => {
                if (!!value) return value.toString();
                else return "0";
            }
        };
    }
};

export const parseMoneyString = (moneyString: string) => {
    const numberString = moneyString.replace(/[^0-9.-]+/g, "");
    return Number(numberString);
};

export const numberSimpleFormatter = (value: number) => {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1) + "B";
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + "M";
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + "K";
    }
    return value;
};

export const getPaddingClass = (value: number) => {
    if (value === 0 || (value >= 2 && value <= 9) || value === 11) return "px-2";
    else if (value === 1) return "px-2.5";
    else if ((value >= 10 && value <= 99) || value === 12) return "px-1.5";
    else return "px-0.5";
};

export const getHeaderPage = (level: number, path: string, exact: boolean) => {
    let result: { pageName: string; breadcrumbsArray: string[] } = {
        pageName: "-",
        breadcrumbsArray: []
    };
    AppMenu.menu.forEach((m) => {
        if (level === 1) {
            if ((exact && m.url === path) || (!exact && path.includes(m.url))) {
                result.pageName = m.name;
                result.breadcrumbsArray = m.url.split("/").slice(1);
                return result;
            }
        } else {
            m.submenu.forEach((sm) => {
                if (level === 2) {
                    if ((exact && sm.url === path) || (!exact && path.includes(sm.url))) {
                        result.pageName = sm.name;
                        result.breadcrumbsArray = sm.url.split("/").slice(1);
                        return result;
                    }
                } else {
                    sm.additionalPages?.forEach((ap) => {
                        if (level === 3) {
                            if ((exact && ap.url === path) || (!exact && path.includes(ap.url))) {
                                result.pageName = ap.name;
                                result.breadcrumbsArray = ap.url.split("/").slice(1);
                                return result;
                            }
                        }
                    })
                }
            })
        }
    });
    return result;
};

export const getBreadcrumbs = (breadcrumbs: string[]) => (
    <div className="flex items-center justify-between mb-3">
        {breadcrumbs && breadcrumbs.map((bc, index) => (
            <div key={index} className="flex items-center justify-between">
                <ChevronRight className={`${index === 0 && "hidden"}`} width="30" height="15" />
                <p className="text-xs text-primary">{capitalizeString(bc)}</p>
            </div>
        ))}
    </div>
);

export const getColorForBarChart = (index: number) => {
    const colors = [ primary10, primary20, primary30, primary40, primary50, primary ];
    return colors[index % colors.length];
};

export const capitalizeString = (value: string) => {
    if (value) return value.charAt(0).toUpperCase() + value.slice(1);
    else return "";
};

export const capitalizeStringWithChar = (value: string, splitter: string = "-") => {
    return value.split(splitter).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

export const toCamelCase = (str: string) => {
    return str.replace(/[^a-zA-Z0-9]+/g, " ").split(" ").map((word, index) => {
        if (index === 0) return word;
        return capitalizeString(word);
    }).join("");
};

export const filename2Str = (str1: string, str2: string) => {
    if (str1 && str2) return `${str1} - ${capitalizeStringWithChar(str2, " ")}`;
    else if (str1) return str1;
    else return "-";
};

export const forLabelString = (docData: any) => {
    let finalLabelString: string = "-";
    if (!!docData && !!docData.label && typeof docData.label === "object" && !!docData.label.en) {
        finalLabelString = docData.label.en;
    } else if (!!docData && !!docData.label_multilanguage && typeof docData.label_multilanguage === "object" && !!docData.label_multilanguage.en) {
        finalLabelString = docData.label_multilanguage.en;
    } else if (!!docData && !!docData.label && typeof docData.label === "string") {
        finalLabelString = docData.label;
    }

    if (!!docData && !!docData.insured_type) return filename2Str(finalLabelString, docData.insured_type);
    else return finalLabelString;
};

export const toastNotification = (text: string, type: "success" | "error" = "success") => {
    toast[type](text, {
        style: {
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            border: `1px solid ${type === "error" ? primaryRed : primary}`,
            borderRadius: "100px",
            padding: "16px",
            color: type === "error" ? primaryRed : primary,
        },
        iconTheme: {
            primary: type === "error" ? primaryRed : primary,
            secondary: "#FFF",
        },
    });
};

export const startDateAndEndDateView = (selectedStartDate: string, selectedEndDate: string) => {
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const startDay = start.getDate();
    const startMonth = monthList[start.getMonth()];
    const startYear = start.getFullYear();
    const endDay = end.getDate();
    const endMonth = monthList[end.getMonth()];
    const endYear = end.getFullYear();

    if (selectedStartDate === selectedEndDate) {
        return `${startDay} ${startMonth} ${startYear}`;
    } else if (startYear === endYear && startMonth === endMonth) {
        return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else if (startYear === endYear) {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    } else {
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    }
};

export const formatDateTimeWithTZ = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
    });

    const parts = formatter.formatToParts(date);
    const finalDate = `${parts.find(p => p.type === "day")?.value}-${parts.find(p => p.type === "month")?.value}-${parts.find(p => p.type === "year")?.value}`;
    const time = `${parts.find(p => p.type === "hour")?.value}:${parts.find(p => p.type === "minute")?.value}:${parts.find(p => p.type === "second")?.value}`;
    const zone = parts.find(p => p.type === "timeZoneName")?.value || "";

    return `${finalDate} ${time} ${zone}`;
};