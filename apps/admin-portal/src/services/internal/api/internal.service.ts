import axios from "axios";

import { INTERNAL_ENDPOINTS } from "./internal.endpoints";
import type { CookiePayload, CookieResponse } from "./internal.types";

const getBaseUrl = () =>
  typeof window !== "undefined" ? window.location.origin : "";

const withBase = (path: string) => `${getBaseUrl()}${path}`;

const post = async <T>(url: string, data?: unknown) =>
  (await axios.post<T>(url, data)).data;
const get = async <T>(url: string) => (await axios.get<T>(url)).data;
const del = async <T>(url: string) => (await axios.delete<T>(url)).data;

export const internalService = {
  setCookie: (payload: CookiePayload) =>
    post<CookieResponse>(withBase(INTERNAL_ENDPOINTS.cookie), payload),
  getCookieByKey: (key: string) =>
    get<CookieResponse>(withBase(INTERNAL_ENDPOINTS.cookieDetail(key))),
  deleteCookieByKey: (key: string) =>
    del<CookieResponse>(withBase(INTERNAL_ENDPOINTS.cookieDetail(key))),
};
