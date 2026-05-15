import { api } from "@/services/api";

interface FormData {
  name: string;
  email: string;
  inquiryType: string;
  website: string;
  message?: string;
}

export const sendFormNotification = async (formData: FormData) => {
  const response = await api.post("/auth/contact-form", {
    name: formData.name,
    email: formData.email,
    inquiryType: formData.inquiryType,
    website: formData.website,
    message: formData.message,
  });
  return response;
};
