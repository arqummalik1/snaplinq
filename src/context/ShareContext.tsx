import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ShareContextType {
  sharedUrl: string | null;
  setSharedUrl: (url: string | null) => void;
  clearSharedUrl: () => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export const ShareProvider = ({ children }: { children: ReactNode }) => {
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  const clearSharedUrl = () => {
    setSharedUrl(null);
  };

  return (
    <ShareContext.Provider value={{ sharedUrl, setSharedUrl, clearSharedUrl }}>
      {children}
    </ShareContext.Provider>
  );
};

export const useShare = () => {
  const context = useContext(ShareContext);
  if (context === undefined) {
    throw new Error('useShare must be used within a ShareProvider');
  }
  return context;
};
