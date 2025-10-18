'use client';
import { SessionProvider } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const color = 'var(--color-primary)';

  return (
    <>
      <SessionProvider>
        <QueryClientProvider client={queryClient}> {children}</QueryClientProvider>

        <Toaster />
        <NextTopLoader color={color} shadow={`0 0 10px ${color},0 0 5px ${color}`} />
      </SessionProvider>
    </>
  );
};
