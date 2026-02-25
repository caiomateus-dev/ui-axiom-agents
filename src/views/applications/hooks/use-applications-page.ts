import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/contexts/ToastContext";

import type { ApplicationFormData } from "../dtos/request/application.schema";
import { applicationSchema } from "../dtos/request/application.schema";
import type { ApplicationResponse } from "../dtos/response/application.response";
import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
  useUpdateApplication,
} from "./use-applications";

export function useApplicationsPage() {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApplicationResponse | null>(null);

  const { data: applications, isLoading, isError } = useApplications();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  function handleOpenCreate() {
    setEditingItem(null);
    reset({ name: "", description: "" });
    setIsModalOpen(true);
  }

  function handleOpenEdit(app: ApplicationResponse) {
    setEditingItem(app);
    reset({ name: app.name, description: app.description });
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editingItem) {
        await updateApplication.mutateAsync({ id: editingItem.id, data });
        toast.success("Application atualizada com sucesso");
      } else {
        await createApplication.mutateAsync(data);
        toast.success("Application criada com sucesso");
      }
      handleCloseModal();
    } catch {
      toast.error(editingItem ? "Erro ao atualizar application" : "Erro ao criar application");
    }
  });

  async function handleDelete(app: ApplicationResponse) {
    const confirmed = window.confirm(`Tem certeza que deseja excluir a application "${app.name}"?`);
    if (confirmed) {
      try {
        await deleteApplication.mutateAsync(app.id);
        toast.success("Application excluída com sucesso");
      } catch {
        toast.error("Erro ao excluir application");
      }
    }
  }

  const isSubmitting = createApplication.isPending || updateApplication.isPending;

  return {
    applications,
    isLoading,
    isError,
    isModalOpen,
    editingItem,
    register,
    errors,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    onSubmit,
    isSubmitting,
    handleDelete,
    isDeleting: deleteApplication.isPending,
  };
}
