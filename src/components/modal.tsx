import React, {CSSProperties, useEffect} from "react";

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

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, widthClassName, heightClassName, bgColor, bgColorModal, style }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`z-[51] fixed inset-0 flex justify-center items-center ${bgColor ? bgColor : "bg-black bg-opacity-50"}`} style={style} onClick={onClose}>
            <div className={`${widthClassName ? widthClassName : "w-full"} ${heightClassName ? heightClassName : "h-full"} ${bgColorModal ? bgColorModal : "bg-white"} rounded-md mx-2 px-4 py-2`} onClick={(e) => e.stopPropagation()}>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
