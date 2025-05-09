import apiClient from "../services/api-client";
import Cookies from "js-cookie";
import { fetchOrReplaceCSRF } from "../services/Cookies/CSRFToken";
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

  const login = async (username: string, password: string) => {
    await fetchOrReplaceCSRF();

    const body = { username, password };

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const response = await apiClient.post<Response>(
        "api/login/",
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
