import { AxiosHttpClient } from "@/lib/axios-http-client";
import { IHttpClient } from "@/lib/http-client-interface";



export class ProductService {
  private httpClientProduct: IHttpClient;

  constructor() {

    this.httpClientProduct = new AxiosHttpClient({
      baseURL: process.env.NEXT_PUBLIC_FRIENDSURE_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_AUTH_TOKEN,
      }
    });
  }
  


  async getProductByInsuranceId(id: string): Promise<any> {
    return this.httpClientProduct.get('/products/insurance/' + id);
  }

  
  async getProductById(id: string): Promise<any> {
    return this.httpClientProduct.get('/v1/products?id=' + id);
  }

}