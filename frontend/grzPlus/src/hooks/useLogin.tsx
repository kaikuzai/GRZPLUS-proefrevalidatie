import apiClient from "../services/api-client";
import { useDispatch } from "react-redux";
import { setAuthorizationLogin } from "../state/authorization/authorizationSlice";

interface LoginResponse {
  access: string;
  refresh: string;
  role?: string;
  email?: string;
  name?: string;
  id?: string;
}

const useLoginUser = () => {
  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    const body = { username, password };

    try {
      const response = await apiClient.post<LoginResponse>(
        "api/users/login/",
        body
      );

      const { access, refresh, role, email, name, id } = response.data;

      // Store tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Update Redux state
      if (email && role && id) {
        await dispatch(
          setAuthorizationLogin({
            isAuthenticated: true,
            email: email,
            role: role,
            id: id,
          })
        );
      }

      return { response: "Succeeded", role, email, name };
    } catch (error: any) {
      console.log(error);
      return { response: "Failed" };
    }
  };

  return { login };
};

export default useLoginUser;
