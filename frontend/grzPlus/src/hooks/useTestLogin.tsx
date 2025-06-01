import apiClient from "../services/api-client";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAuthorizationLogin } from "../state/authorization/authorizationSlice";

interface Response {
  response: string;
  role?: string;
  email?: string;
  name?: string;
}

const useLoginUser = () => {
  const dispatch = useDispatch();

  const login = async () => {
    const body = { username: "bob", password: "wachtwoord" };

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await apiClient.post<Response>(
        "api/users/login/",
        body,
        config
      );
      if (response.data.response === "Succeeded") {
        if (response.data.email && response.data.role) {
          await dispatch(
            setAuthorizationLogin({
              isAuthenticated: true,
              email: response.data.email,
              role: response.data.role,
            })
          );
        }
      }
      return response.data;
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  return { login };
};

export default useLoginUser;
