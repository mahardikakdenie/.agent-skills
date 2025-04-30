import axios from "axios";

export class CookieService {
    async saveCookie(data: any): Promise<any> {
        const baseURL = typeof window !== "undefined" ? window.location.origin : "";
        return await axios.post(`${baseURL}/api/cookie`, data);
    }

    async getCookieByKey(key: string): Promise<string | null> {
        try {
            const baseURL = typeof window !== "undefined" ? window.location.origin : "";
            const response = await axios.get<any>(`${baseURL}/api/cookie/${key}`);
            if (!!response) return response.data.data.value;
            return null;
        } catch (error) {
            console.error("Request failed:", error);
            return null;
        }
    }

    async deleteCookieByKey(key: string): Promise<any> {
        const baseURL = typeof window !== "undefined" ? window.location.origin : "";
        return await axios.delete(`${baseURL}/api/cookie/${key}`);
    }
}
