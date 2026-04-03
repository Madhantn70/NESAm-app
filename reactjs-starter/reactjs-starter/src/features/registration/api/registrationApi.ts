import api from "../../../api/axiosInstance";
import {
  RegistrationVerifyEmailRequest,
  AlumniDataResponse,
  RegistrationOttRequest,
  RegistrationLoginRequest,
  AuthResponseData,
  RegistrationSubmitRequest,
  RegistrationSubmitResponseData,
  ApiResponse,
} from "../models/api/registration";

export const registrationApi = {
  verifyEmail: (req: RegistrationVerifyEmailRequest): Promise<ApiResponse<AlumniDataResponse>> => {
    return api.post("/api/v1/alumni/verify", req) as any;
  },

  requestOtt: (req: RegistrationOttRequest): Promise<ApiResponse<any>> => {
    return api.post("/api/v1/users/ott/token", req) as any;
  },

  loginWithOtt: (req: RegistrationLoginRequest): Promise<ApiResponse<AuthResponseData>> => {
    return api.post("/api/v1/users/ott/login", req) as any;
  },

  submitDetails: (req: RegistrationSubmitRequest): Promise<ApiResponse<RegistrationSubmitResponseData>> => {
    return api.post("/api/v1/users/register", req) as any;
  },
};
