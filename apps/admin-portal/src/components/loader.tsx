"use client";

import React from "react";
import OptimizeImage from "@/components/image";
// TODO: change for customization in env
import whitelableLogo from "@public/whitelable-logo.svg";
import {logo, logoHeight, logoWidth} from "@/constants/app-common.const";

const Loader: React.FC = () => {
    const modalOverlayStyles: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
    };

    const modalContentStyles: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const blinkingLogoStyles: React.CSSProperties = {
        width: "150px",
        animation: "blink 1.5s infinite",
    };

    return (
        <div style={modalOverlayStyles}>
            <div style={modalContentStyles}>
                {/*TODO: change for customization in env*/}
                {process.env.NEXT_PUBLIC_MODE === "whitelable" ? (
                    <OptimizeImage priority={true} width={250} height={100} alt="whitelable-logo" src={whitelableLogo} />
                ) : (
                    <OptimizeImage priority={true} width={logoWidth} height={logoHeight} alt="logo-loader" src={logo} style={blinkingLogoStyles} />
                )}
            </div>

            <style jsx>{`
                @keyframes blink {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.2;
                    }
                }
            `}</style>
        </div>
    );
};

export default Loader;

