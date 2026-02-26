import { Link } from "react-router";

import { useTheme } from "@/contexts";

import { Button, Input } from "@/components";

import { useResetPasswordPage } from "./hooks";

export function ResetPassword() {
  const {
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
  } = useResetPasswordPage();
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

        {!token ? (
          <div className="text-center">
            <p className="text-error-text text-sm mb-4">Token de redefinição não encontrado.</p>
            <Link to="/esqueci-senha" className="text-sm text-brand-500 hover:text-brand-600">
              Solicitar novo link
            </Link>
          </div>
        ) : success ? (
          <div className="text-center">
            <p className="text-text-main text-sm mb-4">Senha redefinida com sucesso!</p>
            <Link to="/login" className="text-sm text-brand-500 hover:text-brand-600">
              Ir para o login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-text-muted text-sm mb-4 text-center">Digite sua nova senha.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                id="new_password"
                label="Nova senha"
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.new_password}
              />

              <Input
                id="confirm_password"
                label="Confirmar senha"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirm_password}
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Redefinir senha
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
