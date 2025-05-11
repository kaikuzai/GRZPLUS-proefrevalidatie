import Cookies from "js-cookie";
import apiClient from "../api-client";

interface Response {
  response: string;
  token: string;
}

export const fetchOrReplaceCSRF = async () => {
  let csrfToken = Cookies.get("csrftoken");

  if (!csrfToken) {
    try {
      const response = await apiClient.get<Response>("api/users/csrf-cookie/");
      if (typeof response.data.token === "string") {
        Cookies.set("csrftoken", response.data.token);
      } else {
        console.log("response had wrong type ", response.data);
      }
    } catch (error) {}
  }
};
