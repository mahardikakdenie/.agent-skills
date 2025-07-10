import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";

export interface ProductConfig {
  id: string;
  name: string;
  type: string;
  search_configs: any;
}
export interface ProductConfigResponse {
  data: ProductConfig;
}

export class ProductConfigService {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getProductConfigByType(type: string): Promise<ProductConfigResponse> {
    try {
      return await this.httpClient.get<ProductConfigResponse>(
        `/product-config/${type}`
      );
    } catch (error) {
      console.error(`Request failed: ${error}`);

      throw error;
    }
  }
}
