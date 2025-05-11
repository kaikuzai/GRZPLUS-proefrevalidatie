import apiClient from "../services/api-client";
import Cookies from "js-cookie";
import { fetchOrReplaceCSRF } from "../services/Cookies/CSRFToken";
import { useDispatch } from "react-redux";
import { setAuthorizationLogout } from "../state/authorization/authorizationSlice";

interface Response {
  response: string;
}

const useLogoutUser = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    await fetchOrReplaceCSRF();

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      await apiClient.post<Response>("api/users/logout/", null, config);
      await Cookies.remove("csrftoken");
      await dispatch(setAuthorizationLogout());
    } catch (error: any) {
      console.error("Error logging out:", error);
    } finally {
      await Cookies.remove("csrftoken");
    }
  };

  return { logout };
};

export default useLogoutUser;
