import apiClient from './api-client';

export interface TokenValidationResponse {
  valid: boolean;
  reason?: 'expired' | 'not_found';
}

export interface PasswordSetRequest {
  token: string;
  password: string;
  confirm_password: string;
}

const authService = {
  validateToken: async (token: string): Promise<TokenValidationResponse> => {
    try {
      const response = await apiClient.post('api/users/password/validate-token', {
        token: token,
        action: 'validate_token' 
      });
      return response.data;
    } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false, reason: 'not_found' };
    }
  },

  setPassword: async (data: PasswordSetRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('api/users/password/set', {
        data: data, 
        action: 'set_password'
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error setting password:', error);
      let message = 'An error occurred while setting your password.';
      if (error) {
        message = message;
      }
      return { success: false, message };
    }
  }
};

export default authService;