import { axiosClient } from '../../../../core/api/axiosClient';
import { RegistrationRequest, RegistrationResponse } from '../model/Registration';

export const registerUser = async (data: RegistrationRequest): Promise<RegistrationResponse> => {
  const response = await axiosClient.post<RegistrationResponse>('/api/auth/register', data);
  return response.data;
};
