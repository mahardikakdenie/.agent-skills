import React from "react";

const PageNotFound: React.FC = () => {
    return (
        <div className="h-[calc(100vh-50px)] flex flex-col items-center justify-center">
            <h1 className="font-bold text-3xl">404 - Page Not Found</h1>
            <p className="mx-5 text-center">Oops! The page you are looking for does not exist.</p>
        </div>
    );
};

export default PageNotFound;
