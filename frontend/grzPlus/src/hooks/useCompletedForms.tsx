import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosError } from "axios";

interface SubmittedForm {
  id: number;
  formId: string;
  formName: string;
  patientName: string;
  patientEmail: string;
  submittedAt: string;
  answers: string;
}

interface FormIcon {
  name: string;
  description: string;
  image: string | null;
  slug: string;
}

const useCompletedForms = () => {
  const [completedFormSlugs, setCompletedFormSlugs] = useState<string[]>([]);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompletedForms = async () => {
      try {
        setIsLoading(true);

        // Fetch submitted forms for the current user
        const submittedResponse = await apiClient.get<SubmittedForm[]>(
          "api/forms/submitted/"
        );

        // Fetch all available forms to map form IDs to slugs
        const formsResponse = await apiClient.get<FormIcon[]>(
          "api/forms/form-icons/"
        );

        // Create a map of form names to slugs
        const formNameToSlugMap = new Map<string, string>();
        formsResponse.data.forEach((form) => {
          formNameToSlugMap.set(form.name, form.slug);
        });

        // Extract unique form slugs from submitted forms
        const uniqueFormSlugs = new Set<string>();
        submittedResponse.data.forEach((submission) => {
          const slug = formNameToSlugMap.get(submission.formName);
          if (slug) {
            uniqueFormSlugs.add(slug);
          }
        });

        setCompletedFormSlugs(Array.from(uniqueFormSlugs));
      } catch (error) {
        setError(error as AxiosError);
        console.error("Error fetching completed forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedForms();
  }, []);

  return { completedFormSlugs, error, isLoading };
};

export default useCompletedForms;
