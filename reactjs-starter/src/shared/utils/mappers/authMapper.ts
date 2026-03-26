import { AuthResponse } from "@/domains/public/login/models/api/auth";
import { AuthView } from "@/domains/public/login/models/view/auth";

export const mapAuthResponseToViewState = (response: AuthResponse): AuthView => {
  return {
    token: response.token,
    isAuthenticated: !!response.token,
  };
};
