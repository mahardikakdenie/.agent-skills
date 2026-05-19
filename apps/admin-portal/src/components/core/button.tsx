import React, { useEffect, useState } from 'react';

import { Box } from '@repo/ui';

import { primary, primaryRed, primaryYellow } from '@/constants/app-common.const';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'danger' | 'warning';
  withIcon?: boolean;
  disabled?: boolean;
  additionalClassName?: string;
  className?: string;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
  withIcon,
  disabled,
  additionalClassName,
}) => {
  const [bgColorDefault, setBgColorDefault] = useState(primary);
  const [bgHoverColor, setBgHoverColor] = useState(primary);
  const [borderColorDefault, setBorderColorDefault] = useState(primary);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    switch (variant) {
      case 'danger':
        setBgColorDefault('#FFF');
        setBorderColorDefault(primaryRed);
        setBgHoverColor(primaryRed);
        break;
      case 'warning':
        setBgColorDefault(primaryYellow);
        setBorderColorDefault(primaryYellow);
        setBgHoverColor(primaryYellow);
        break;
      default:
        setBgColorDefault(primary);
        setBorderColorDefault(primary);
        setBgHoverColor(primary);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      as="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => !disabled && onClick()}
      className={`px-6 py-3 rounded-3xl text-base
                ${withIcon && 'flex items-center justify-center gap-2'}
                ${
                  variant === 'danger'
                    ? 'hover:text-white hover:font-semibold hover:bg-red-500 border border-red-500 text-red-500'
                    : variant === 'warning'
                      ? 'hover:opacity-80 bg-warning border border-warning text-black'
                      : 'hover:opacity-80 bg-primary text-white border border-primary'
                }
                ${additionalClassName}
            `}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? '#D1D5DB' : isHovered ? bgHoverColor : bgColorDefault,
        borderColor: disabled ? '#D1D5DB' : borderColorDefault,
      }}
    >
      {children}
    </Box>
  );
};

export default Button;
