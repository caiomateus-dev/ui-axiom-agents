import { useState } from "react";
import type { FormEvent } from "react";

import { forgotPasswordRequest } from "../api/forgot-password";
import { forgotPasswordSchema } from "../dtos/request/forgot-password.schema";

export function useForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors: { email?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as "email";
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/redefinir-senha`;
      await forgotPasswordRequest({ email, redirect_url: redirectUrl });
      setSuccess(true);
    } catch {
      setApiError("Erro ao enviar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    errors,
    apiError,
    loading,
    success,
    handleSubmit,
  };
}
