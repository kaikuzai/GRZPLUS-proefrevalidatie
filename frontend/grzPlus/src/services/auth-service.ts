// src/api/authService.ts
import axios from 'axios';
import apiClient from './api-client';
import Cookies from 'js-cookie';
import { fetchOrReplaceCSRF } from './Cookies/CSRFToken';

export interface TokenValidationResponse {
  valid: boolean;
  reason?: 'expired' | 'not_found';
}

export interface PasswordSetRequest {
  token: string;
  password: string;
  confirm_password: string;
}

const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

const authService = {
  validateToken: async (token: string): Promise<TokenValidationResponse> => {
    try {
      setTimeout(() => {
      fetchOrReplaceCSRF();
      }, 1000)

      const response = await apiClient.post('api/users/password/validate-token/', {
        token: token,
        action: 'validate_token' 
      }, 
    config);
      return response.data;
    } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false, reason: 'not_found' };
    }
  },

  setPassword: async (data: PasswordSetRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('api/users/password/set/', {data: data, action: 'set_password'}, config);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error setting password:', error);
      let message = 'An error occurred while setting your password.';
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.error || message;
      }
      return { success: false, message };
    }
  }
};

export default authService;