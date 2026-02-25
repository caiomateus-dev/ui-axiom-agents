import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/contexts/ToastContext";

import type { VectorStoreFormData } from "../dtos/request/vector-store.schema";
import { vectorStoreSchema } from "../dtos/request/vector-store.schema";
import type { VectorStoreResponse } from "../dtos/response/vector-store.response";
import {
  useCreateVectorStore,
  useDeleteVectorStore,
  useUpdateVectorStore,
  useVectorStores,
} from "./use-vector-stores";

export function useVectorStoresPage() {
  const toast = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<VectorStoreResponse | null>(null);
  const [deletingStore, setDeletingStore] = useState<VectorStoreResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const { data: stores, isLoading, isError } = useVectorStores();
  const createStore = useCreateVectorStore();
  const updateStore = useUpdateVectorStore();
  const deleteStore = useDeleteVectorStore();

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<VectorStoreFormData>({
    resolver: zodResolver(vectorStoreSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<VectorStoreFormData>({
    resolver: zodResolver(vectorStoreSchema),
  });

  function handleOpenCreate() {
    resetCreate();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsCreateOpen(true);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
    resetCreate();
  }

  function handleOpenEdit(store: VectorStoreResponse) {
    resetEdit({
      agent_id: store.agent_id,
      titulo: store.description || "",
      descricao: store.description || "",
      text: "",
    });
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
    setEditingStore(store);
  }

  function handleCloseEdit() {
    setEditingStore(null);
    resetEdit();
  }

  async function onCreateHandler(data: VectorStoreFormData) {
    const formData = new FormData();
    formData.append("agent_id", String(data.agent_id));
    formData.append("titulo", data.titulo);
    if (data.descricao) {
      formData.append("descricao", data.descricao);
    }
    if (data.text) {
      formData.append("text", data.text);
    }
    if (fileInputRef.current?.files?.[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    }
    try {
      await createStore.mutateAsync(formData);
      toast.success("Vector Store criado com sucesso");
      handleCloseCreate();
    } catch {
      toast.error("Erro ao criar Vector Store");
    }
  }

  function onCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleCreateSubmit(onCreateHandler)(e);
  }

  async function onEditHandler(data: VectorStoreFormData) {
    if (!editingStore) return;
    const formData = new FormData();
    formData.append("agent_id", String(data.agent_id));
    formData.append("titulo", data.titulo);
    if (data.descricao) {
      formData.append("descricao", data.descricao);
    }
    if (data.text) {
      formData.append("text", data.text);
    }
    if (editFileInputRef.current?.files?.[0]) {
      formData.append("file", editFileInputRef.current.files[0]);
    }
    try {
      await updateStore.mutateAsync({ id: editingStore.id, data: formData });
      toast.success("Vector Store atualizado com sucesso");
      handleCloseEdit();
    } catch {
      toast.error("Erro ao atualizar Vector Store");
    }
  }

  function onEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleEditSubmit(onEditHandler)(e);
  }

  async function handleDelete() {
    if (!deletingStore) return;
    try {
      await deleteStore.mutateAsync(deletingStore.id);
      toast.success("Vector Store excluído com sucesso");
      setDeletingStore(null);
    } catch {
      toast.error("Erro ao excluir Vector Store");
    }
  }

  return {
    stores,
    isLoading,
    isError,
    isCreateOpen,
    editingStore,
    deletingStore,
    setDeletingStore,
    fileInputRef,
    editFileInputRef,
    registerCreate,
    createErrors,
    registerEdit,
    editErrors,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
    onCreateSubmit,
    isCreating: createStore.isPending,
    onEditSubmit,
    isUpdating: updateStore.isPending,
    handleDelete,
    isDeleting: deleteStore.isPending,
  };
}
