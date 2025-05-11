import apiClient from "../services/api-client";
import Cookies from "js-cookie";

interface Response {
  response: string;
}

const useRegisterPatient = () => {
  const register = async (
    firstName: string,
    lastName: string,
    email: string
  ) => {
    const body = {
      email,
      firstName,
      lastName,
      role: "patient",
      password: "wachtwoord123",
    };

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
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

export default useRegisterPatient;
