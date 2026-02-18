"use client";

import React, { useState } from "react";
import { msalConfig } from "@/config/msal.config";

// Storage key for our code_verifier
export const PKCE_CODE_VERIFIER_KEY = "pkce_code_verifier";

/**
 * Generate a random code_verifier for PKCE (43-128 characters)
 */
const generateCodeVerifier = (length = 64): string => {
  if (length < 43 || length > 128) {
    throw new Error("PKCE code_verifier length must be between 43 and 128");
  }

  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  let verifier = "";
  for (let i = 0; i < length; i++) {
    verifier += charset[randomValues[i] % charset.length];
  }

  return verifier;
};

/**
 * Generate code_challenge from code_verifier using SHA256
 */
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

interface MicrosoftLoginButtonProps {
  clientId: string;
  tenantId: string;
  redirectUri: string;
}

export const MicrosoftLoginButton = ({
  clientId,
  tenantId,
  redirectUri,
}: MicrosoftLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const authority = msalConfig.auth.authority(tenantId) || "";
  // Check if we have valid config. Note: msalConfig.auth.authority might be constructed with "undefined" string if env missing
  const isConfigValid = clientId && authority && !authority.endsWith("undefined");

  if (!isConfigValid) {
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store code_verifier in sessionStorage for later retrieval
      sessionStorage.setItem(PKCE_CODE_VERIFIER_KEY, codeVerifier);

      // Build authorization URL manually
      const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", "openid profile email User.Read");
      authUrl.searchParams.set("response_mode", "query");
      authUrl.searchParams.set("prompt", "select_account");
      authUrl.searchParams.set("code_challenge", codeChallenge);
      authUrl.searchParams.set("code_challenge_method", "S256");

      // Redirect to Microsoft login
      window.location.href = authUrl.toString();
    } catch (error: any) {
      console.error("Login Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button 
      type="button"
      className="mt-3 px-4 py-2 rounded-3xl text-xs flex justify-center items-center gap-2 bg-[#2F2F2F] hover:bg-[#2F2F2F]/90 text-white transition-opacity hover:opacity-80"
      onClick={handleLogin}
      disabled={isLoading}
    >
      {/* Microsoft Logo SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
      <span>{isLoading ? "Redirecting..." : "Sign in with Microsoft"}</span>
    </button>
  );
};




