import { Link } from "react-router";

import { useTheme } from "@/contexts";

import { Button, Input } from "@/components";

import { useForgotPasswordPage } from "./hooks";

export function ForgotPassword() {
  const { email, setEmail, errors, apiError, loading, success, handleSubmit } =
    useForgotPasswordPage();
  const { theme } = useTheme();

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

        {success ? (
          <div className="text-center">
            <p className="text-text-main text-sm mb-4">
              Se o email estiver cadastrado, você receberá um link para redefinir sua senha.
            </p>
            <Link to="/login" className="text-sm text-brand-500 hover:text-brand-600">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-text-muted text-sm mb-4 text-center">
              Informe seu email para receber um link de redefinição de senha.
            </p>

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

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Enviar link de redefinição
              </Button>
            </form>

            {apiError && <p className="text-sm text-error-text mt-3">{apiError}</p>}

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-brand-500 hover:text-brand-600">
                Voltar para o login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
