import { api } from "@/services/api";

interface FormData {
  name: string;
  email: string;
  companyName: string;
  website: string;
  goals?: string;
}

export const sendFormNotification = async (formData: FormData) => {
  const response = await api.post("/auth/contact-form", {
    name: formData.name,
    email: formData.email,
    companyName: formData.companyName,
    website: formData.website,
    goals: formData.goals,
  });
  return response;
};
