'use client'
import React, { createContext, useContext, useState } from 'react';

const StickyContext = createContext();

export const useSticky = () => useContext(StickyContext);

export const StickyProvider = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <StickyContext.Provider value={{ isSticky, setIsSticky }}>
      {children}
    </StickyContext.Provider>
  );
};
