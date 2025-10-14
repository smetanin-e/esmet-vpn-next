import { getMeClient } from './get-me-client';
import { getMeServer } from './get-me-server';

export const getMe = async () => {
  if (typeof window === 'undefined') {
    return getMeServer();
  }
  return getMeClient();
};
