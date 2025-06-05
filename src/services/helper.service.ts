import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";

export class HelperService {
  private httpClientCookie: IHttpClient;

  constructor() {
    this.httpClientCookie = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_HELPER_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });
  }

  async htmlToPdf(content: string, filename: string) {
    console.log(content);
    return this.httpClientCookie.post("/v1/html2pdf", { content, filename });
  }

  async htmlToPdfGenerate(content: string, filename: string) {
    console.log(content);
    return this.httpClientCookie.post("/v1/html2pdf/generate-pdf-service", { content, filename });
  }

  async getCalendar(where?: any, page?: number, pageSize?: number): Promise<any> {
    let qs = '';
    if (page && pageSize) {
      qs = `?page=${page}&pageSize=${pageSize}`;
    }

    if (Object.keys(where).length > 0) {
      qs += (qs === '' ? '?' : '&') + `${Object.keys(where).map(key => `${key}=${where[key]}`).join('&')}`;
    }
    return this.httpClientCookie.get('/v1/calendar/' + qs);
  }


  async createCalendar(data: any) {
    return this.httpClientCookie.post('/v1/calendar', data);
  }

  async updateCalendar(id: string, data: any) {
    return this.httpClientCookie.put('/v1/calendar/' + id, data);
  }
  async deleteCalendar(id: string) {
    return this.httpClientCookie.delete('/v1/calendar/' + id);
  }
}