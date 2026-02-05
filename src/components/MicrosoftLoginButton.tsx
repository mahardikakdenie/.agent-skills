"use client";

import React, { useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/msal.config";
import { toastNotification } from "@/helpers/app.helper";

export const MicrosoftLoginButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const msalInstance = new PublicClientApplication(msalConfig);
            await msalInstance.initialize();
            await msalInstance.loginRedirect({
                scopes: ["User.Read"],
                prompt: "select_account"
            });
        } catch (error: any) {
            console.error("MSAL Initialization/Login Error:", error);
            toastNotification("Failed to initialize Microsoft Sign-In", "error");
            setIsLoading(false);
        }
    };

    return (
        <button 
            type="button"
            className="w-full mt-3 px-4 py-2 rounded-3xl text-xs flex justify-center items-center gap-2 bg-[#2F2F2F] hover:bg-[#2F2F2F]/90 text-white transition-opacity hover:opacity-80"
            onClick={handleLogin}
            disabled={isLoading}
        >
             {/* Microsoft Logo SVG */}
             <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
             <span>{isLoading ? "Redirecting..." : "Sign in with Microsoft"}</span>
        </button>
    );
};
