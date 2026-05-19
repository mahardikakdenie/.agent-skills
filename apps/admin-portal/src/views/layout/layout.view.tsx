'use client';

import whitelableLogo from '@public/whitelable-logo.svg';
import { isEmpty } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu } from 'react-feather';

import { Box, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui';

// TODO: change for customization in env
import Button from '@/components/core/button';
import ChecklistIcon from '@/components/core/checklist.icon';
import OptimizeImage from '@/components/core/image';
import Input from '@/components/core/input';
import { MicrosoftLoginButton } from '@/components/core/microsoft-login-button';
import Modal from '@/components/core/modal';
import XIcon from '@/components/core/x.icon';
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
import { authService } from '@/services/auth/api/auth.service';

type SidebarTooltipSide = 'bottom' | 'right';

interface SidebarMenuButtonProps {
  icon?: React.ReactNode;
  isActive: boolean;
  name: string;
  onClick: () => void;
  tooltipSide: SidebarTooltipSide;
}

function SidebarMenuButton({ icon, isActive, name, onClick, tooltipSide }: SidebarMenuButtonProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const label = labelRef.current;

    if (!label) return undefined;

    const updateOverflow = () => {
      setIsOverflowing(label.scrollWidth > label.clientWidth + 1);
    };

    updateOverflow();
    const animationFrame = window.requestAnimationFrame(updateOverflow);
    const timeout = window.setTimeout(updateOverflow, 250);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateOverflow) : null;

    resizeObserver?.observe(label);
    window.addEventListener('resize', updateOverflow);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateOverflow);
    };
  }, [name]);

  const button = (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      onMouseEnter={() => {
        const label = labelRef.current;

        if (!label) return;

        setIsOverflowing(label.scrollWidth > label.clientWidth + 1);
      }}
      aria-current={isActive ? 'page' : undefined}
      className={`group mb-0.5 flex min-h-10 w-full cursor-pointer items-center justify-start gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
        isActive
          ? 'bg-[#E8F4FB] text-[#006EA7] ring-1 ring-inset ring-[#B9DDEA]'
          : 'text-[#334155] hover:bg-[#F3F8FB] hover:text-[#0F172A]'
      }`}
    >
      <Box
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
          isActive
            ? 'bg-white text-[#006EA7] [&_svg]:text-[#006EA7]'
            : 'bg-white text-[#006EA7] ring-1 ring-inset ring-slate-100 group-hover:bg-white group-hover:ring-[#D6EAF3] [&_svg]:text-[#006EA7]'
        }`}
      >
        {icon}
      </Box>
      <Box
        ref={labelRef}
        as="span"
            className={`min-w-0 flex-1 truncate text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}
      >
        {name}
      </Box>
    </Box>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      {isOverflowing && (
        <TooltipContent
          side={tooltipSide}
          align={tooltipSide === 'right' ? 'center' : 'start'}
          className="max-w-64"
        >
          {name}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

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

  const isSubmenuActive = (submenu: (typeof AppMenu.menu)[number]['submenu'][number]) =>
    path === submenu.url || submenu.additionalPages?.some((page) => path.startsWith(page.url));

  const doLogin = () => login({ email, password });

  const doLogout = () => {
    setEmail('');
    setPassword('');
    logout();
  };

  const changePassword = async () => {
    try {
      await authService.changeAccountPassword(user.sub, {
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
          isMenuOpen && !isMobileView ? 'sm:w-[calc(100%-16rem)] sm:ml-64' : 'w-full'
        } ${!user && 'w-full'} transition-all duration-300 z-50`}
        ref={navbarRef}
      >
        <Box className="w-full outline-none">
          <Box className="py-2">
            <Box className="items-center flex">
              <Box
                as="button"
                onClick={toggleModal}
                aria-label="Toggle sidebar"
                className="mr-auto cursor-pointer p-0 text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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
                  <Box className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.45),0_8px_18px_-12px_rgba(15,23,42,0.18)]">
                    <Box className="flex flex-col gap-1">
                      <Box
                        as="button"
                        type="button"
                        onClick={() => setIsModalChangePassword(true)}
                        className="flex min-h-10 w-full cursor-pointer items-center rounded-md px-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-primary-light-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                      >
                        Change Password
                      </Box>
                      <Box
                        as="button"
                        type="button"
                        onClick={doLogout}
                        className="flex min-h-10 w-full cursor-pointer items-center rounded-md px-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-100"
                      >
                        Logout
                      </Box>
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
          isMenuOpen && !isMobileView ? 'sm:w-[calc(100%-16rem)] sm:ml-64' : 'w-full'
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
          widthClassName="w-[500px] max-w-[calc(100vw-24px)]"
          heightClassName="h-fit"
          bgColorModal="bg-white rounded-xl overflow-hidden shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55),0_12px_28px_-20px_rgba(15,23,42,0.3)]"
          isOpen={isModalChangePassword}
          onClose={() => setIsModalChangePassword(false)}
        >
          <Box className="flex items-center justify-center border-b border-slate-100 px-2 py-4">
            <Box as="h2" className="text-lg font-bold text-slate-950">
              Change Password
            </Box>
          </Box>
          <Box className="h-fit max-h-[calc(80vh-76px)] overflow-y-auto sm:scrollable px-2 py-5 sm:px-6">
            <Box className="mb-5 text-sm text-slate-700">
              Choose a strong password and don&#39;t reuse it for other accounts.
            </Box>
            <Box className="w-full">
              <Box className="mb-4">
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(value) => setOldPassword(value.toString())}
                  placeholder="Old Password"
                  withBorder={true}
                />
              </Box>
              <Box className="mb-4">
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
            <Box className="mb-5 text-sm leading-5 text-slate-700">
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
          widthClassName="w-[500px] max-w-[calc(100vw-24px)]"
          heightClassName="h-fit"
          isOpen={isMenuOpen}
          onClose={() => setMenu(false)}
        >
          <Box className="flex min-h-[76px] items-center justify-center rounded-t-md border-b border-slate-100 bg-white px-3 py-2">
            <Box className={`${!!process.env.NEXT_PUBLIC_LOGO && 'px-2'}`}>
              {/*TODO: change for customization in env*/}
              {process.env.NEXT_PUBLIC_MODE === 'whitelable' ? (
                <OptimizeImage
                  priority
                  width={250}
                  height={100}
                  alt="whitelable-logo-mobile"
                  src={whitelableLogo}
                  className="h-auto max-w-full !w-[180px]"
                />
              ) : (
                <OptimizeImage
                  priority
                  width={logoWidth ? Math.max(logoWidth, 185) : 185}
                  height={logoHeight ? Math.max(logoHeight, 81) : 81}
                  alt="logo-mobile"
                  src={logo}
                  className="h-auto max-w-full !w-[180px]"
                />
              )}
            </Box>
          </Box>
          <Box className="h-fit max-h-[calc(75vh-72px)] overflow-y-auto sm:scrollable px-3 py-3">
            <TooltipProvider delayDuration={350}>
              {AppMenu.menu.map(
                (menuMobile, menuMobileIndex) =>
                  menuList.includes(menuMobile.name) && (
                    <Box
                      key={menuMobileIndex}
                      className={`${menuMobileIndex !== 0 && 'mt-3'} pb-2`}
                    >
                      <Box
                        as="p"
                        className="mb-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400"
                      >
                        {menuMobile.name}
                      </Box>
                      {menuMobile.submenu.map((submenuMobile, submenuIndex) => {
                        const isActive = isSubmenuActive(submenuMobile);

                        return (
                          submenuList.includes(submenuMobile.name) && (
                            <SidebarMenuButton
                              key={submenuIndex}
                              icon={submenuMobile.icon}
                              isActive={isActive}
                              name={submenuMobile.name}
                              onClick={() => goToPage(submenuMobile.url)}
                              tooltipSide="bottom"
                            />
                          )
                        );
                      })}
                    </Box>
                  ),
              )}
            </TooltipProvider>
          </Box>
        </Modal>
      ) : (
        <Box
          className={`fixed top-0 left-0 hidden h-full border-r border-slate-200/80 bg-white shadow-[8px_0_24px_-22px_rgba(15,23,42,0.45)] transition-transform duration-300 ease-out sm:inline ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '16rem' }}
        >
          <Box className="h-full flex flex-col">
            <Box className="flex min-h-[76px] items-center justify-center border-b border-slate-100 px-3 py-2">
              <Box className={`${!!process.env.NEXT_PUBLIC_LOGO && 'px-2'}`}>
                {/*TODO: change for customization in env*/}
                {process.env.NEXT_PUBLIC_MODE === 'whitelable' ? (
                  <OptimizeImage
                    priority
                    width={250}
                    height={100}
                    alt="whitelable-logo"
                    src={whitelableLogo}
                    className="h-auto max-w-full !w-[180px]"
                  />
                ) : (
                  <OptimizeImage
                    priority
                    width={logoWidth ? Math.max(logoWidth, 185) : 185}
                    height={logoHeight ? Math.max(logoHeight, 81) : 81}
                    alt="logo"
                    src={logo}
                    className="h-auto max-w-full !w-[180px]"
                  />
                )}
              </Box>
            </Box>
            <Box className="sm:scrollable flex-1 overflow-y-auto px-3 py-3">
              <TooltipProvider delayDuration={350}>
                {AppMenu.menu.map(
                  (menu, menuIndex) =>
                    menuList.includes(menu.name) && (
                      <Box key={menuIndex} className={`${menuIndex !== 0 && 'mt-3'} pb-2`}>
                        <Box
                          as="p"
                          className="mb-1.5 px-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400"
                        >
                          {menu.name}
                        </Box>
                        {menu.submenu.map((submenu, submenuIndex) => {
                          const isActive = isSubmenuActive(submenu);

                          return (
                            submenuList.includes(submenu.name) && (
                              <SidebarMenuButton
                                key={submenuIndex}
                                icon={submenu.icon}
                                isActive={isActive}
                                name={submenu.name}
                                onClick={() => goToPage(submenu.url)}
                                tooltipSide="right"
                              />
                            )
                          );
                        })}
                      </Box>
                    ),
                )}
              </TooltipProvider>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
