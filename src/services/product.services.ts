import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";
import { getCookie } from "@/lib/utils";

export class ProductService {

  private httpClientCookie: IHttpClient;

  constructor() {

    this.httpClientCookie = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("token"),
      },
    });
  }
  
  async getProductByInsuranceId(ids: string[], pageSize: number, page: number): Promise<any> {
    const params = new URLSearchParams();
    

    ids.forEach(id => params.append('insuranceIds[]', id));
    
    params.append('pageSize', pageSize.toString());
    params.append('page', page.toString());
  
    const url = `/v1/products?${params.toString()}`;
    return this.httpClientCookie.get(url);
  }

  
  async getProductById(id: string): Promise<any> {
    return this.httpClientCookie.get('/v1/products?id=' + id);
  }

  async getPromotionCategories(): Promise<any> {
    return this.httpClientCookie.get('/v1/categories');
  }

  async getSpecProdbyCatIdAndInsId(catId: string, insId: string): Promise<any> {
    return this.httpClientCookie.get('/v1/products?categoryId=' + catId +"&insuranceId=" + insId);
  }

}