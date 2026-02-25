import { Navigate } from "react-router";

import { Button, Input } from "@/components";
import { useTheme } from "@/contexts";

import { useLoginPage } from "./hooks";

export function Login() {
  const {
    isAuthenticated,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    apiError,
    loading,
    handleSubmit,
  } = useLoginPage();
  const { theme } = useTheme();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-canvas">
      <div className="bg-bg-card rounded-xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img
            src={theme === "dark" ? "/logos/logo-brand-dark.png" : "/logos/logo-brand-light.png"}
            alt="Axiom Agents"
            className="h-12 object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        {apiError && <p className="text-sm text-error-text mt-3">{apiError}</p>}
      </div>
    </div>
  );
}
