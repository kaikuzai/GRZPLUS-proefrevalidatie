import { useState } from "react";
import apiClient from "../services/api-client";

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
  file?: File;
}

interface UseSubmitFormResult {
  submitForm: (
    formId: string,
    formName: string,
    values: FormValues,
    file?: File | null
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
   * @param file - Optional image or video file to upload
   * @returns Promise resolving to true if submission was successful
   */
  const submitForm = async (
    formId: string,
    formName: string,
    values: FormValues,
    file?: File | null
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

      const formData = new FormData();

      // Create the submission object in the required format
      const formSubmissionData: FormSubmission = {
        formId,
        formName,
        answers,
      };

      formData.append("formData", JSON.stringify(formSubmissionData));

      if (file) {
        formData.append("file", file);
      }

      console.log("Submitting form data:", formSubmissionData);
      if (file) {
        console.log("submitting file:", file.name, file.type, file.size);
      }

      const body = formData;

      // Make the API call
      const response = await apiClient.post<Response>(
        "api/forms/submit/",
        body
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
