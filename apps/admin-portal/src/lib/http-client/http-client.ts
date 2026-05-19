export class HttpClient {
    async put(url: string, data?: any): Promise<any> {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return response.json();
    }
  }