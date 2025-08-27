import { hasInsurers } from "@/context/auth.context";
import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";


interface Response {
  data: any;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}

interface Insurer {
  insurance: string;
}

export class SanctionService {
  private httpClientSanction: IHttpClient;
  private httpClientCountry: IHttpClient;

  constructor() {
    
    this.httpClientSanction = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_SANCTION_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.httpClientCountry = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_COUNTRY_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

  }
  
  async getCountry(): Promise<Response> {
    return this.httpClientCountry.get('/countries');
  }

  async getSourceList(page: number, limit: number): Promise<Response> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientSanction.get(`/v1/sources/paging?page=${page}&limit=${limit}`);

  }

  async getSanctionSearchQuery(query: string, page: number, limit: number): Promise<Response> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientSanction.get(
      `/v1/blacklist/search/query?query=${query}&page=${page}&limit=${limit}`);
  }

  async getSourceSearchQuery(query: string, page: number, limit: number): Promise<Response> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientSanction.get(
      `/v1/sources/search/query?query=${query}&page=${page}&limit=${limit}`);
  }

  async getSanctionList(page: number, limit: number): Promise<Response> {
    if (page <= 0) {
      page = 1;
    }
    return this.httpClientSanction.get(
      `/v1/blacklist?page=${page}&limit=${limit}`
    )
  }

  async getSanctionById(id: string): Promise<Response> {
    return this.httpClientSanction.get(`/v1/blacklist/${id}?id=${id}`);
  }
  
  async getSourceById(id: string): Promise<Response> {
    return this.httpClientSanction.get(`/v1/sources/${id}?id=${id}`);
  }

  async deleteDiscSanctionById(id: string): Promise<any> {
    return this.httpClientSanction.delete(`/v1/blacklist/delete/${id}?id=${id}`);
  }
  
  async deleteDiscSourceById(id: string): Promise<any> {
    return this.httpClientSanction.delete(`/v1/sources/delete/${id}?id=${id}`);
  }

  async createSanction(data: any): Promise<any> {
    return this.httpClientSanction.post('/v1/blacklist', data);
  }

  async createSource(data: any): Promise<any> {
    return this.httpClientSanction.post('/v1/sources', data);
  }

  async getSources(): Promise<any> {
    return this.httpClientSanction.get('/v1/sources/paging?page=1&limit=1000');
  }

  async updateSanction(id: string, data: any): Promise<any> {
    return this.httpClientSanction.put(`/v1/blacklist/update/${id}?id=${id}`, data);
  }

  async updateSource(id: string, data: any): Promise<any> {
    return this.httpClientSanction.put(`/v1/sources/update/${id}?id=${id}`, data);
  }

  
}


