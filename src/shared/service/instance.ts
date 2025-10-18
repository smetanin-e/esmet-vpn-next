import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : process.env.API_URL_SERVER,
  headers: {
    Authorization:
      typeof window !== 'undefined'
        ? `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_TOKEN}`
        : `Bearer ${process.env.INTERNAL_API_TOKEN}`,
  },
});
