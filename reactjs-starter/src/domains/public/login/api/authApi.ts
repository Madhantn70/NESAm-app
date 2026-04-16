import { axiosClient } from '../../../../../core/api/axiosClient';
import { LoginRequest, LoginResponse } from '../model/Auth';

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/api/auth/login', data);
  return response.data;
};
