import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {CookieService} from "@/services/masterdata/cookie.service";

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