import axios from "axios";

export class CookieService {
    async saveCookie(data: any): Promise<any> {
        try {
            return await axios.post("/api/cookie", data);
        } catch (error) {
            console.error("Request failed:", error);
            throw error;
        }
    }

    async getCookieByKey(key: string): Promise<string | null> {
        try {
            const response = await axios.get<any>(`/api/cookie/${key}`);
            if (!!response) return response.data.data.value;
            return null;
        } catch (error) {
            console.error("Request failed:", error);
            throw error;
        }
    }

    async deleteCookieByKey(key: string): Promise<any> {
        try {
            return await axios.delete(`/api/cookie/${key}`);
        } catch (error) {
            console.error("Request failed:", error);
            throw error;
        }
    }
}
