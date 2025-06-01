import apiClient from "../services/api-client";
import Cookies from "js-cookie";

interface Response {
  response: string;
}

const useRegisterCaregiver = () => {
  const register = async (
    firstName: string,
    lastName: string,
    email: string
  ) => {
    const body = {
      email,
      firstName,
      lastName,
      role: "caregiver",
      password: "wachtwoord123",
    };

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await apiClient.post<Response>(
        "api/users/register/",
        body,
        config
      );
      if (response.data.response === "Succeeded") {
        console.log("user has been created");
      }
      return response.data;
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  return { register };
};

export default useRegisterCaregiver;
