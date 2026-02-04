import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CookieService } from "@/services/masterdata/cookie.service";
import { ClaimFieldInputType, ClaimForm } from "@/interface";
import dayjs from "dayjs";

export const generateYears = (startYear: number = 2014): string[] => {
  const currentYear = dayjs().year();
  const years: string[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString());
  }

  return years;
};

export const generateMonths = (
  format: string = "MMMM"
): Array<{ value: string; name: string }> => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    name: dayjs().month(i).format(format),
  }));
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const cookieService = new CookieService();

export async function getCookie(name: string): Promise<string | null> {
  try {
    const value = cookieService.getCookieByKey(name);
    if (!!value) return await value;
    return null;
  } catch (error) {
    return null;
  }
}

export const flattenClaimFormFields = (
  items: ClaimForm[],
  parentField?: string
): any => {
  let result: any = {};
  items.map((item: ClaimForm) => {
    if (item.type == ClaimFieldInputType.Fields) {
      result = {
        ...result,
        ...flattenClaimFormFields(item.fields ?? [], item.name),
      };
    } else {
      if (parentField) {
        result[`${parentField}.${item.name}`] = item;
      } else {
        result[item.name] = item;
      }
    }
  });

  return result;
};

export const mapNestedFieldsClaim = (
  fields: ClaimForm[],
  formValueClaim: any,
  type?: "general" | "claim" | "claim_config" | null
): ClaimForm[] => {
  return fields.map((field: ClaimForm) => {
    if (
      field.type.toLowerCase() === ClaimFieldInputType.Fields &&
      field.fields
    ) {
      const data = {
        ...field,
        fields: mapNestedFieldsClaim(field.fields, formValueClaim, type),
      };
      if (type) {
        data.form = type;
      }
      return data;
    } else if (field.type.toLowerCase() === ClaimFieldInputType.File) {
      let value = null;
      if (typeof formValueClaim[field.name] == "object") {
        if (
          formValueClaim[field.name].data != "" &&
          formValueClaim[field.name].ext != ""
        ) {
          if (
            formValueClaim?.[field.name]?.data?.indexOf("http://") > -1 ||
            formValueClaim?.[field.name]?.data?.indexOf("https://") > -1
          ) {
            value = formValueClaim[field.name].data;
          } else {
            value = {
              ext: formValueClaim[field.name].ext,
              data: formValueClaim[field.name].data,
            };
          }
        }
      }
      const data = {
        ...field,
        value: value,
      };
      if (type) {
        data.form = type;
      }
      return data;
    } else {
      const data = {
        ...field,
        value: formValueClaim[field.name] || null,
      };
      if (type) {
        data.form = type;
      }
      return data;
    }
  });
};

export function applyFieldUpdates(
  schema: ClaimForm[],
  updates: Record<string, any>
): ClaimForm[] {
  const clone = structuredClone(schema);
  const inject = (node: any): void => {
    if (updates[node.name] !== undefined) {
      const val = updates[node.name];
      if (
        val &&
        typeof val === "object" &&
        typeof val.data === "string" &&
        /^(http?:)?\/\//.test(val.data)
      ) {
        node.value = val.data;
      } else {
        node.value = val;
      }
    }

    if (Array.isArray(node.fields)) {
      node.fields.forEach(inject);
    }
  };

  clone.forEach(inject);
  return clone;
}

export const filterSchemaByNames = (
  source: ClaimForm[],
  matcher: { name: string }[]
): ClaimForm[] => {
  const wanted = new Set(matcher.map((m) => m.name));

  const hasWantedName = (node: any): boolean => {
    if (!node || typeof node !== "object") return false;
    if (wanted.has(node.name)) return true;

    if (Array.isArray(node.fields) && node.fields.some(hasWantedName)) {
      return true;
    }

    for (const value of Object.values(node)) {
      if (Array.isArray(value) && value.some(hasWantedName)) return true;
      if (typeof value === "object" && hasWantedName(value)) return true;
    }
    return false;
  };

  return source.filter(hasWantedName);
};

export const claimHasValue = (document: any): boolean => {
  if (!document) return false;

  if (document.type === "fields") {
    if (!document.fields || !Array.isArray(document.fields)) {
      return false;
    }

    return document.fields
      .filter((field: any) => field.type === "file")
      .every((field: any) => {
        return claimHasValue(field);
      });
  }

  if (document.type === "file") {
    return !!(document.value && document.value !== "");
  }

  return !!(document.value && document.value !== "" && document.value !== null);
};

export const calculateTotalPremium = (transaction: any) => {
  const currencies = transaction?.insurance?.insurance?.currencies || [];
  const currency = currencies.find(
    (currency: any) =>
      currency.currency_from === transaction?.insurance?.currency &&
      currency.currency_to === "IDR"
  );

  const convertedPremium =
    (currency?.value ?? 1) * transaction?.insurance?.premium;

  const discountType =
    transaction?.insurance?.plan?.premium_discount_type || "";
  const discountValue =
    transaction?.insurance?.plan?.premium_discount_value || 0;

  const premiumWithEmbeddedDiscount =
    discountType === "percentage"
      ? convertedPremium - (discountValue / 100) * convertedPremium
      : convertedPremium - discountValue;

  let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
  if (transaction?.voucher_info) {
    premiumWithVoucherDiscount =
      transaction.voucher_info?.data.value_type === "percentage"
        ? premiumWithEmbeddedDiscount -
          (transaction.voucher_info?.data.value / 100) *
            premiumWithEmbeddedDiscount
        : premiumWithEmbeddedDiscount - transaction.voucher_info?.data.value;
  }

  let totalPremium = premiumWithVoucherDiscount;

  if (transaction?.fees) {
    totalPremium =
      premiumWithVoucherDiscount +
      transaction.fees
        .map((v: any) => v.value)
        .reduce((a: any, b: any) => a + b, 0);
  }

  return totalPremium;
};
