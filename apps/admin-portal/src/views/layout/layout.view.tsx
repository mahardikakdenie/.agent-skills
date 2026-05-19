'use client';

import whitelableLogo from '@public/whitelable-logo.svg';
import { isEmpty } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';

import { Box } from '@repo/ui';

// TODO: change for customization in env
import Button from '@/components/core/button';
import OptimizeImage from '@/components/core/image';
import Input from '@/components/core/input';
import { MicrosoftLoginButton } from '@/components/core/microsoft-login-button';
import Modal from '@/components/core/modal';
import ApiURL from '@/constants/api-url.const';
import {
  backgroundImageApp,
  logo,
  logoHeight,
  logoWidth,
  primary10,
  primaryRed,
} from '@/constants/app-common.const';
import AppMenu from '@/constants/app-menu.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { toastNotification } from '@/lib/app-utils';
import ChecklistIcon from '@/components/core/checklist.icon';
import XIcon from '@/components/core/x.icon';
import { authService } from '@/services/api.service';

export const LayoutView = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalChangePassword, setIsModalChangePassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobileView, isMenuOpen, setMenu } = useScreen();
  const {
    user,
    menuList,
    submenuList,
    isAuthenticated,
    isForbidden,
    login,
    logout,
    getLoginProviders,
    loginProviders,
  } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
        setShowDropdown(false);
    };

    if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (!navbarRef.current) return;
      document.documentElement.style.setProperty(
        '--fs-navbar-height',
        `${navbarRef.current.offsetHeight}px`,
      );
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);

    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, [isMenuOpen, isMobileView, user]);

  const toggleModal = () => setMenu(!isMenuOpen);

  const goToPage = (url: string) => {
    router.push(url);
    if (isMobileView) setMenu(false);
  };

  const doLogin = () => login({ email, password });

  const doLogout = () => {
    setEmail('');
    setPassword('');
    logout();
  };

  const changePassword = async () => {
    try {
      await authService.put(ApiURL.v1ChangePassword(user.sub), {
        newPassword,
        oldPassword,
      });
      setIsModalChangePassword(false);
      logout();
    } catch (error: any) {
      toastNotification(error?.response?.data?.message || 'Failed to change password.', 'error');
    }
  };

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
    };
  };

  const handleChangeNewPassword = (value: string) => {
    setShowPasswordRequirements(true);
    setNewPassword(value);
    setValidations(validatePassword(value));
  };

  const renderPasswordRequirements = () => {
    const requirements = [
      { text: 'Minimum 8 characters', isValid: validations.minLength },
      {
        text: 'At least one uppercase letter',
        isValid: validations.hasUpperCase,
      },
      {
        text: 'At least one lowercase letter',
        isValid: validations.hasLowerCase,
      },
      { text: 'At least one number', isValid: validations.hasNumber },
      {
        text: 'At least one special character',
        isValid: validations.hasSpecialChar,
      },
    ];

    return (
      <>
        <Box className="text-xs font-medium mt-0.5 mb-2">Password Requirements</Box>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req, index) => (
            <Box key={index} className="flex items-center gap-2 text-xs">
              <Box>
                {req.isValid
                  ? ChecklistIcon('#00AB4F', '16', '16')
                  : XIcon(primaryRed, '16', '16', '0 0 23 23')}
              </Box>
              {req.text}
            </Box>
          ))}
        </Box>
      </>
    );
  };

  useEffect(() => {
    const hostname = window.location.host;
    getLoginProviders(hostname);
  }, [user]);

  return (
    <Box>
      {!isAuthenticated && !searchParams.get('session_code') && (
        <Modal
          bgColor="bg-[#F3FBFF]"
          bgColorModal="bg-transparent"
          style={{
            backgroundColor: primary10,
            backgroundImage: backgroundImageApp,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '30%',
            backgroundPosition: 'bottom right',
          }}
          widthClassName={isMobileView ? 'w-full' : 'sm:w-[500px]'}
          heightClassName="h-fit"
          isOpen={true}
          onClose={() => {}}
        >
          <Box className="bg-white rounded-md shadow flex flex-col items-center justify-center py-10">
            <Box className="flex items-center justify-center mb-3 -ml-5">
              <Box className={`${!!process.env.NEXT_PUBLIC_LOGO && 'py-4 px-2'}`}>
                {/*TODO: change for customization in env*/}
                {process.env.NEXT_PUBLIC_MODE === 'whitelable' ? (
                  <OptimizeImage
                    priority
                    width={250}
                    height={100}
                    alt="whitelable-logo-login"
                    src={whitelableLogo}
                  />
                ) : (
                  <OptimizeImage
                    priority
                    width={logoWidth || 189}
                    height={logoHeight || 83}
                    alt="logo-login"
                    src={logo}
                  />
                )}
              </Box>
            </Box>
            <Box className="w-3/4">
              {!isEmpty(loginProviders) && (
                <>
                  <Box as="p" className="text-center mb-4">
                    Welcome!
                  </Box>
                  <Box>
                    {loginProviders.map((provider) => (
                      <Box key={`provider-${provider.client_id}`} className="w-full mt-2">
                        <MicrosoftLoginButton
                          clientId={provider.client_id || ''}
                          tenantId={provider.tenant_id || ''}
                          redirectUri={provider.redirect_url || ''}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Box className="flex items-center w-full text-gray-300 my-5">
                    <Box className="flex-grow h-px bg-gray-300" />
                    <Box as="span" className="px-4 text-sm">
                      Or
                    </Box>
                    <Box className="flex-grow h-px bg-gray-300" />
                  </Box>
                </>
              )}

              <Box className="mb-5">
                <Input
                  value={email}
                  onChange={(value) => setEmail(value.toString())}
                  onEnter={doLogin}
                  placeholder="Email"
                  withBorder={true}
                />
              </Box>
              <Box>
                <Input
                  type="password"
                  value={password}
                  onChange={(value) => setPassword(value.toString())}
                  onEnter={doLogin}
                  placeholder="Password"
                  withBorder={true}
                />
              </Box>
            </Box>
            <Button additionalClassName="my-5 w-3/4 py-3" onClick={doLogin} variant="warning">
              Login
            </Button>
          </Box>
        </Modal>
      )}

      <Box
        as="nav"
        className={`px-6 navbar-top bg-primary sticky top-0 left-0 ${
          isMenuOpen && !isMobileView ? 'sm:w-[calc(100%-20%)] sm:ml-[20%]' : 'w-full'
        } ${!user && 'w-full'} transition-all duration-300 z-50`}
        ref={navbarRef}
      >
        <Box className="w-full outline-none">
          <Box className="py-2">
            <Box className="items-center flex">
              <Box
                as="button"
                onClick={toggleModal}
                className="min-w-10 px-0 text-bluedark mr-auto"
              >
                <Menu color="white" />
              </Box>
              <Box
                className="relative flex items-center gap-1 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
                ref={dropdownRef}
              >
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center justify-between mr-3">
                    <Box as="p" className="text-sm text-white">
                      Hi, {user?.name || 'Anonymous'}
                    </Box>
                    <Box
                      className={`transition-transform duration-300 ${
                        showDropdown ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      <ChevronDown color="white" width="30" height="15" />
                    </Box>
                  </Box>
                  <Box className="rounded-full h-8 w-8 bg-primary-light-foreground flex items-center justify-center">
                    <Box as="p" className="text-primary font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </Box>
                  </Box>
                </Box>

                {showDropdown && (
                  <Box className="w-52 absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md py-5 px-7">
                    <Box className="flex flex-col items-center justify-center">
                      <Button
                        variant="warning"
                        onClick={() => setIsModalChangePassword(true)}
                        additionalClassName="w-full"
                      >
                        Change Password
                      </Button>
                      <Button variant="danger" onClick={doLogout} additionalClassName="w-full mt-3">
                        Logout
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        as="main"
        className={`flex flex-col overflow-y-auto sm:scrollable bg-[#F8F8F8] ${
          isMenuOpen && !isMobileView ? 'sm:w-[calc(100%-20%)] sm:ml-[20%]' : 'w-full'
        } transition-all duration-300`}
        style={{
          backgroundImage: backgroundImageApp,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '30%',
          backgroundPosition: 'bottom right',
          height: 'calc(100vh - var(--fs-navbar-height, 64px))',
        }}
      >
        {/* {children} */}
        {isForbidden ? (
          <Box className="h-[calc(100vh-50px)] flex flex-col items-center justify-center">
            <Box as="h1" className="font-bold text-3xl">
              403 - Forbidden
            </Box>
            <Box as="p" className="mx-5 text-center">
              Oops! You don&apos;t have permission for this page.
            </Box>
          </Box>
        ) : isAuthenticated && user ? (
          children
        ) : path.startsWith('/oauth/') ? (
          // Allow OAuth callback pages to render without authentication
          children
        ) : null}
      </Box>

      {isModalChangePassword && (
        <Modal
          widthClassName={`w-[500px] ${isMobileView ? 'px-5' : 'px-10'} px-5`}
          heightClassName="h-fit"
          isOpen={isModalChangePassword}
          onClose={() => setIsModalChangePassword(false)}
        >
          <Box className="flex justify-center items-center mb-3 bg-white rounded-t-md">
            <Box className="pt-5 pb-3 px-2 text-xl font-bold">Change Password</Box>
          </Box>
          <Box className="h-fit max-h-[calc(70vh-50px)] overflow-y-auto sm:scrollable mb-5">
            <Box className="text-sm mb-5">
              Choose a strong password and don&#39;t reuse it for other accounts.
            </Box>
            <Box className="w-full">
              <Box className="mb-5">
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(value) => setOldPassword(value.toString())}
                  placeholder="Old Password"
                  withBorder={true}
                />
              </Box>
              <Box className="mb-5">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(value) => handleChangeNewPassword(value.toString())}
                  placeholder="New Password"
                  withBorder={true}
                />
                {showPasswordRequirements ? renderPasswordRequirements() : null}
              </Box>
              <Box className="mb-5">
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(value) => setConfirmNewPassword(value.toString())}
                  placeholder="Confirm New Password"
                  withBorder={true}
                  errorMessage={
                    newPassword !== confirmNewPassword
                      ? 'Passwords do not match. Please re-enter your confirmation password.'
                      : undefined
                  }
                />
              </Box>
            </Box>
            <Box className="text-sm mb-5">
              Once your password has been changed, please log back in with the new password on all
              your devices.
            </Box>
            <Box className="flex justify-center items-center">
              <Button variant="warning" onClick={changePassword}>
                Change Password
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {isMobileView ? (
        <Modal
          widthClassName="w-[500px]"
          heightClassName="h-fit"
          isOpen={isMenuOpen}
          onClose={() => setMenu(false)}
        >
          <Box className="flex justify-center items-center mb-3 bg-white rounded-t-md">
            <Box className={`${!!process.env.NEXT_PUBLIC_LOGO && 'py-5 px-2'}`}>
              {/*TODO: change for customization in env*/}
              {process.env.NEXT_PUBLIC_MODE === 'whitelable' ? (
                <OptimizeImage
                  priority
                  width={250}
                  height={100}
                  alt="whitelable-logo-mobile"
                  src={whitelableLogo}
                />
              ) : (
                <OptimizeImage
                  priority
                  width={logoWidth}
                  height={logoHeight}
                  alt="logo-mobile"
                  src={logo}
                />
              )}
            </Box>
          </Box>
          <Box className="h-fit max-h-[calc(70vh-50px)] overflow-y-auto sm:scrollable mb-5">
            {AppMenu.menu.map(
              (menuMobile, menuMobileIndex) =>
                menuList.includes(menuMobile.name) && (
                  <Box key={menuMobileIndex} className={`${menuMobileIndex !== 0 && 'mt-5'}`}>
                    <Box as="p" className="font-semibold mb-3 text-sm">
                      {menuMobile.name}
                    </Box>
                    {menuMobile.submenu.map(
                      (submenuMobile, submenuIndex) =>
                        submenuList.includes(submenuMobile.name) && (
                          <Box
                            key={submenuIndex}
                            onClick={() => goToPage(submenuMobile.url)}
                            className={`flex items-center justify-start py-2 px-3 rounded-md hover:bg-primary-foreground cursor-pointer mb-3 ${
                              (path.includes(submenuMobile.url) ||
                                submenuMobile.additionalPages?.some((page) =>
                                  path.startsWith(page.url),
                                )) &&
                              'bg-primary-foreground'
                            }`}
                          >
                            <Box className="flex items-center mr-3">{submenuMobile.icon}</Box>
                            <Box
                              as="p"
                              className={`${
                                (path.includes(submenuMobile.url) ||
                                  submenuMobile.additionalPages?.some((page) =>
                                    path.startsWith(page.url),
                                  )) &&
                                'font-semibold'
                              } text-sm`}
                            >
                              {submenuMobile.name}
                            </Box>
                          </Box>
                        ),
                    )}
                  </Box>
                ),
            )}
          </Box>
        </Modal>
      ) : (
        <Box
          className={`fixed top-0 left-0 h-full px-4 py-2 hidden sm:inline bg-white transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '20%' }}
        >
          <Box className="h-full flex flex-col">
            <Box className="flex justify-center items-center">
              <Box className={`${!!process.env.NEXT_PUBLIC_LOGO && 'py-5 px-2 mb-3'}`}>
                {/*TODO: change for customization in env*/}
                {process.env.NEXT_PUBLIC_MODE === 'whitelable' ? (
                  <OptimizeImage
                    priority
                    width={250}
                    height={100}
                    alt="whitelable-logo"
                    src={whitelableLogo}
                  />
                ) : (
                  <OptimizeImage
                    priority
                    width={logoWidth}
                    height={logoHeight}
                    alt="logo"
                    src={logo}
                  />
                )}
              </Box>
            </Box>
            <Box className="overflow-y-auto sm:scrollable flex-1">
              {AppMenu.menu.map(
                (menu, menuIndex) =>
                  menuList.includes(menu.name) && (
                    <Box key={menuIndex} className="mb-5">
                      <Box as="p" className="font-semibold mb-3 text-sm">
                        {menu.name}
                      </Box>
                      {menu.submenu.map(
                        (submenu, submenuIndex) =>
                          submenuList.includes(submenu.name) && (
                            <Box
                              key={submenuIndex}
                              onClick={() => goToPage(submenu.url)}
                              className={`flex items-center justify-start p-2 rounded-md hover:bg-primary-foreground cursor-pointer mb-3 ${
                                (path == submenu.url ||
                                  submenu.additionalPages?.some((page) =>
                                    path.startsWith(page.url),
                                  )) &&
                                'bg-primary-foreground'
                              }`}
                            >
                              <Box className="flex items-center mr-3">{submenu.icon}</Box>
                              <Box
                                as="p"
                                className={`${
                                  (path == submenu.url ||
                                    submenu.additionalPages?.some((page) =>
                                      path.startsWith(page.url),
                                    )) &&
                                  'font-semibold'
                                } text-sm`}
                              >
                                {submenu.name}
                              </Box>
                            </Box>
                          ),
                      )}
                    </Box>
                  ),
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
