"use client";

import { createContext, useContext, useState } from "react";

const NotFoundContext = createContext<boolean>(false);
const SetNotFoundContext = createContext<(value: boolean) => void>(() => {});

export const NotFoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNotFound, setIsNotFound] = useState(false);

  return (
    <NotFoundContext.Provider value={isNotFound}>
      <SetNotFoundContext.Provider value={setIsNotFound}>
        {children}
      </SetNotFoundContext.Provider>
    </NotFoundContext.Provider>
  );
};

export const useNotFound = () => useContext(NotFoundContext);
export const useSetNotFound = () => useContext(SetNotFoundContext);
