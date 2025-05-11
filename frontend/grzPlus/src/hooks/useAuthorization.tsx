import apiClient from "../services/api-client";

interface Response {
  name: string;
  request_session: object;
  is_authenticated: boolean;
  is_anonymous: boolean;
}

const useAuthorizationCheck = () => {
  const fetchAuthorization = async () => {
    try {
      const response = await apiClient.get<Response>(
        "api/users/authenticated/"
      );
      console.log("this is the response", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  return { fetchAuthorization };
};

export default useAuthorizationCheck;
