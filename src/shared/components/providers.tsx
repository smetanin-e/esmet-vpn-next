'use client';
import { SessionProvider } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const color = 'var(--color-primary)';
  return (
    <>
      <SessionProvider>
        {children}

        <Toaster />
        <NextTopLoader color={color} shadow={`0 0 10px ${color},0 0 5px ${color}`} />
      </SessionProvider>
    </>
  );
};
