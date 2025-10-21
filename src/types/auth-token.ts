class AuthToken {
    private static instance: AuthToken;
    private _token: string | null = null;

    private constructor() {}

    public static getInstance(): AuthToken {
        if (!AuthToken.instance) {
            AuthToken.instance = new AuthToken();
        }
        return AuthToken.instance;
    }

    get token(): string | null{
        return this._token
    }
    set token(value: string){
        this._token = value;
    }

    clearToken() {
        this._token = null
    }
}

export const authToken = AuthToken.getInstance()