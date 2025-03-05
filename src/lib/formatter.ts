export const formatMoney = (
  amount: number,
  currency: string = "IDR"
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
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
