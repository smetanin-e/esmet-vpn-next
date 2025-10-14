import { axiosInstance } from '@/shared/services/instance';

export async function refreshFeatureClient() {
  const res = await axiosInstance.post('/auth/refresh', null, { withCredentials: true });
  return res.data; // { user, accessToken, success }
}
