import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";

import { resetPasswordRequest } from "../api/reset-password";
import { resetPasswordSchema } from "../dtos/request/reset-password.schema";

export function useResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ new_password?: string; confirm_password?: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = resetPasswordSchema.safeParse({
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: { new_password?: string; confirm_password?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as "new_password" | "confirm_password";
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
    } catch {
      setApiError("Token inválido ou expirado. Solicite uma nova redefinição.");
    } finally {
      setLoading(false);
    }
  }

  return {
    token,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    apiError,
    loading,
    success,
    handleSubmit,
  };
}
