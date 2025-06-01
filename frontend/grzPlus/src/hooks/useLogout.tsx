import apiClient from "../services/api-client";
import { useDispatch } from "react-redux";
import { setAuthorizationLogout } from "../state/authorization/authorizationSlice";

const useLogoutUser = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await apiClient.post("api/users/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error: any) {
      console.error("Error logging out:", error);
    } finally {
      // Clear tokens and update state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      await dispatch(setAuthorizationLogout());
    }
  };

  return { logout };
};

export default useLogoutUser;
