import React, { CSSProperties, useEffect } from 'react';

import { Box } from '@repo/ui';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string;
  heightClassName?: string;
  bgColor?: string;
  bgColorModal?: string;
  style?: CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  widthClassName,
  heightClassName,
  bgColor,
  bgColorModal,
  style,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Box
      className={`z-[51] fixed inset-0 flex justify-center items-center ${bgColor ? bgColor : 'bg-black/45'}`}
      style={style}
      onClick={onClose}
    >
      <Box
        className={`${widthClassName ? widthClassName : 'w-full'} ${heightClassName ? heightClassName : 'h-full'} rounded-lg mx-2 px-4 py-2 ${bgColorModal ? bgColorModal : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

export default Modal;
