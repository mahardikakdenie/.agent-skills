'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Box } from '@repo/ui';

import { useAuth } from '@/context/auth.context';
import { toastNotification } from '@/helpers/app.helper';

export const MsalCallbackView = () => {
  const router = useRouter();
  const { loginEntra } = useAuth();

  // Storage key for our code_verifier (must match MicrosoftLoginButton)
  const PKCE_CODE_VERIFIER_KEY = 'pkce_code_verifier';

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Parse the authorization code from query string (response_mode=query)
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
          // Extract code_verifier from sessionStorage
          const codeVerifier = sessionStorage.getItem(PKCE_CODE_VERIFIER_KEY);

          if (!codeVerifier) {
            console.error('[MsalCallbackView] PKCE code_verifier not found in sessionStorage');
            toastNotification('Authentication error: missing PKCE verifier', 'error');
            router.push('/');
            return;
          }

          await loginEntra(code, codeVerifier);

          // Fallback redirect if AuthContext doesn't handle it
          router.push('/');
        } else {
          toastNotification('No authorization code received', 'error');
          router.push('/');
        }
      } catch (error: any) {
        console.error('[MsalCallbackView] Error:', error);
        toastNotification('Failed to complete Microsoft Sign-In', 'error');
        router.push('/');
      }
    };

    handleRedirect().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Box className="text-center">
        <Box as="h2" className="text-2xl font-semibold mb-2">
          Authenticating with Microsoft...
        </Box>
        <Box className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></Box>
      </Box>
    </Box>
  );
};
