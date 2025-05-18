import Cookies from "js-cookie";
import apiClient from "../services/api-client";
import { useState } from "react";
import { AxiosError } from "axios";

interface Response {
  response: string;
}

interface InviteUserForm {
  email: string;
  first_name: string;
  last_name: string;
  supporter: string;
  supporter_first_name: string;
  supporter_last_name: string;
  [key: string]: string | undefined;
}

const useInviteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState(false);

  const invite = async (form: InviteUserForm) => {
    setLoading(true);

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const response = await apiClient.post<Response>(
        "api/users/invite-user/",
        form,
        config
      );
      if (response.data.response === "Succeeded") {
        console.log("user has been invited");
        setSuccess(true);
      }
    } catch (error) {
      setError(error as AxiosError);
      console.log("Error while inviting user", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, invite };
};
