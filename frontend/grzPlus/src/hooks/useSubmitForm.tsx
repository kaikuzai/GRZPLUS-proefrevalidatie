import { useState } from "react";
import apiClient from "../services/api-client";
import Cookies from "js-cookie";

// Form values structure as used in your DynamicForm component
interface FormValueItem {
  value: string;
  label: string;
}

interface FormValues {
  [key: string]: FormValueItem;
}

// Structure for the API submission
interface FormSubmission {
  formId: string;
  formName: string;
  answers: {
    [key: string]: string;
  };
}

interface UseSubmitFormResult {
  submitForm: (
    formId: string,
    formName: string,
    values: FormValues
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

interface Response {
  response: string;
}

/**
 * Custom hook to handle form submission with the required formatting
 * @returns Object with submitForm function, loading state, and error state
 */
const useSubmitForm = (): UseSubmitFormResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Prepares and submits form data in the required format
   * @param formId - The ID of the form
   * @param formName - The name of the form
   * @param values - Form values with labels from the DynamicForm component
   * @returns Promise resolving to true if submission was successful
   */
  const submitForm = async (
    formId: string,
    formName: string,
    values: FormValues
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Transform values from { fieldId: { value, label } } to { label: value }
      const answers: { [key: string]: string } = {};

      Object.keys(values).forEach((fieldId) => {
        // Use the label as the key instead of the fieldId
        const label = values[fieldId].label;
        answers[label] = values[fieldId].value;
      });

      // Create the submission object in the required format
      const formSubmission: FormSubmission = {
        formId,
        formName,
        answers,
      };

      console.log("Submitting form data:", formSubmission);

      const body = JSON.stringify(formSubmission);
      const config = {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      };

      // Make the API call
      // Replace with your actual API endpoint
      const response = await apiClient.post<Response>(
        "api/forms/submit/",
        body,
        config
      );

      const data = await response.data.response;
      console.log("Form submitted successfully:", data);

      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error submitting form:", errorMessage);
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  return { submitForm, loading, error };
};

export default useSubmitForm;
