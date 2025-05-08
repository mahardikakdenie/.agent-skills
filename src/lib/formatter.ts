import moment from "moment";

export const formatMoney = (
  amount: number,
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export const formatMoneyClaim = (amount: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const capitalizeStringWithChar = (value: string, splitter: string = "-") => {
  return value.split(splitter).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
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

export const formatDate = (
  date: string,
  format: string = "YYYY-MM-DD"
): string => {
  return moment(date).format(format);
};
