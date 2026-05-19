import moment from "moment";

export const formatMoney = (
  amount: number,
  currency: string = ""
): string => {
  if (currency && currency != "") {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  }

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
  const absValue = Math.abs(value);
  const suffixes = [
    { threshold: 1_000_000_000_000_000_000_000_000_000, suffix: "Oc" },
    { threshold: 1_000_000_000_000_000_000_000_000, suffix: "Sp" },
    { threshold: 1_000_000_000_000_000_000_000, suffix: "Sx" },
    { threshold: 1_000_000_000_000_000_000, suffix: "Qi" },
    { threshold: 1_000_000_000_000_000, suffix: "Qa" },
    { threshold: 1_000_000_000_000, suffix: "T" },
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ];
  const matchedSuffix = suffixes.find(({ threshold }) => absValue >= threshold);

  if (matchedSuffix) {
    return (value / matchedSuffix.threshold).toFixed(1) + matchedSuffix.suffix;
  }
  return value;
};

export const formatDate = (
  date: string,
  format: string = "YYYY-MM-DD"
): string => {
  return moment(date).format(format);
};

export const formatDateTime = (
  date: string,
  format: string = "DD-MM-YYYY HH:mm:ss"
): string => {
  return moment(date).format(format);
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
