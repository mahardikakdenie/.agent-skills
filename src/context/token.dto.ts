export interface ClaimToken {
    email: string;
    phone_number: string;
    sub: string;
    name: string;
    role: string;
    channel: string;
    permission_list: string[];
    iat: number;
    exp: number;
  }