'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Loader from '@/components/loader';
import Modal from '@/components/modal';
import { minWidthContainer } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import WifiOffIcon from '@/images/wifi-off.icon';

interface ScreenContextType {
  isMobileView: boolean;
  isLoading: boolean;
  isMenuOpen: boolean;
  setLoading: (loading: boolean) => void;
  setMenu: (menu: boolean) => void;
}

const ScreenContext = createContext<ScreenContextType>({
  isMobileView: false,
  isLoading: false,
  isMenuOpen: true,
  setLoading: () => {},
  setMenu: () => {},
});

interface ScreenProviderProps {
  children: ReactNode;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [isModalNetworkOpen, setIsModalNetworkOpen] = useState<boolean>(true);
  const { isNetworkActive, handleChangeNetwork } = useAuth();

  const handleResize = useCallback(() => {
    setIsMobileView(window.innerWidth < minWidthContainer);
    setIsMenuOpen(window.innerWidth >= minWidthContainer);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const setLoading = (loading: boolean) => setIsLoading(loading);

  const setMenu = (menu: boolean) => setIsMenuOpen(menu);

  const setIsNetworkActiveToTrue = () => {
    handleChangeNetwork(true);
    setIsModalNetworkOpen(false);
  };

  return (
    <ScreenContext.Provider value={{ isMobileView, isLoading, isMenuOpen, setLoading, setMenu }}>
      {isLoading && <Loader />}
      {!isNetworkActive && (
        <Modal
          widthClassName="lg:w-[500px]"
          heightClassName="h-fit"
          isOpen={isModalNetworkOpen}
          onClose={setIsNetworkActiveToTrue}
        >
          <Box className="flex flex-col items-center justify-center py-5">
            <Box className="flex items-center justify-center mb-3">
              {WifiOffIcon(undefined, '70', '70', '0 0 24 24')}
            </Box>
            <Box as="h1" className="font-bold text-lg text-center mb-2">
              Oops! Your internet connection is not active or the server is under maintenance.
            </Box>
            <Box as="p" className="text-center text-xs">
              Please check your internet and try again later!
            </Box>
            <Box as="p" className="mb-3 text-center text-xs">
              Don&apos;t reload this page if you are doing transaction, just close this pop up and
              trigger again.
            </Box>
            <Button onClick={setIsNetworkActiveToTrue}>Sure</Button>
          </Box>
        </Modal>
      )}
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = (): ScreenContextType => useContext(ScreenContext);
