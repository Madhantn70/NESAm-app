import { AuthResponse } from "../../models/api/auth";
import { AuthView } from "../../models/view/auth";

export const mapAuthResponseToViewState = (response: AuthResponse): AuthView => {
  return {
    token: response.token,
    isAuthenticated: !!response.token,
  };
};
