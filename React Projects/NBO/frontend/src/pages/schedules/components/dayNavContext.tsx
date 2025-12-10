import React, { createContext, useContext, useState } from "react";

type DayNavState = {
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  setNavState: React.Dispatch<
    React.SetStateAction<{
      isPrevDisabled: boolean;
      isNextDisabled: boolean;
    }>
  >;
};

const DayNavContext = createContext<DayNavState | null>(null);

export const useDayNav = () => {
  const ctx = useContext(DayNavContext);
  if (!ctx) {
    throw new Error("useDayNav must be used inside DayNavProvider");
  }
  return ctx;
};

export const DayNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navState, setNavState] = useState({
    isPrevDisabled: false,
    isNextDisabled: false,
  });

  return (
    <DayNavContext.Provider value={{ ...navState, setNavState }}>
      {children}
    </DayNavContext.Provider>
  );
};
