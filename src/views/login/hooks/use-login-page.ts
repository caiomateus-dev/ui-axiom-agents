import { useState } from "react";
import type { FormEvent } from "react";

import { useAuth } from "@/contexts";

import { loginSchema } from "../dtos/request/login.schema";

export function useLoginPage() {
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as "email" | "password";
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setApiError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return {
    isAuthenticated,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    apiError,
    loading,
    handleSubmit,
  };
}
