import { LoginFormType } from '@/shared/schemas/login-schema';
import { axiosInstance } from '../instance';

export async function signIn(data: LoginFormType) {
  return (await axiosInstance.post('/auth/login', data, { withCredentials: true })).data;
}
