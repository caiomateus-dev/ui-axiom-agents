import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { FileText, Image, Mic, MicOff, Paperclip, Send, X } from "lucide-react";

export interface ChatInputPayload {
  text: string;
  image?: File;
  audio?: Blob;
  file?: File;
}

interface ChatInputProps {
  onSend: (payload: ChatInputPayload) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleSend() {
    const trimmed = text.trim();
    if ((!trimmed && !image && !audioBlob && !file) || disabled) return;
    onSend({
      text: trimmed,
      image: image ?? undefined,
      audio: audioBlob ?? undefined,
      file: file ?? undefined,
    });
    setText("");
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFile(null);
    setAudioBlob(null);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(f);
    setImagePreview(URL.createObjectURL(f));
    e.target.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    e.target.value = "";
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
  }

  function removeFile() {
    setFile(null);
  }

  function removeAudio() {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioPreviewUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      // microphone permission denied
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  }

  function formatSeconds(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  const hasAttachment = !!image || !!audioBlob || !!file;
  const canSend = (text.trim().length > 0 || hasAttachment) && !disabled;

  return (
    <div className="border-t border-border-subtle">
      {/* Attachments preview bar */}
      {hasAttachment && (
        <div className="flex items-center gap-3 px-4 pt-3 flex-wrap">
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="preview"
                className="h-16 w-16 rounded-lg object-cover border border-border-strong"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 bg-bg-card border border-border-strong rounded-full p-0.5 text-text-muted hover:text-text-main"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {audioPreviewUrl && (
            <div className="flex items-center gap-2 bg-bg-card border border-border-strong rounded-lg px-3 py-2">
              <Mic className="w-4 h-4 text-brand-400 shrink-0" />
              <audio controls src={audioPreviewUrl} className="h-6 max-w-[180px]" />
              <button onClick={removeAudio} className="text-text-muted hover:text-text-main ml-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {file && (
            <div className="flex items-center gap-2 bg-bg-card border border-border-strong rounded-lg px-3 py-2 text-xs text-text-main max-w-[200px]">
              <FileText className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="truncate">{file.name}</span>
              <button
                onClick={removeFile}
                className="text-text-muted hover:text-text-main ml-1 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 px-4 pt-2 text-xs text-error-text">
          <span className="inline-block w-2 h-2 rounded-full bg-error-text animate-pulse" />
          Gravando {formatSeconds(recordingSeconds)}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 p-4">
        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Media buttons */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={disabled || isRecording}
          title="Anexar imagem"
          className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Image className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRecording}
          title="Anexar arquivo"
          className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          title={isRecording ? "Parar gravação" : "Gravar áudio"}
          className={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
            isRecording
              ? "text-error-text bg-error-bg hover:bg-error-bg/80"
              : "text-text-muted hover:text-text-main hover:bg-bg-surface"
          }`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording
              ? "Gravando..."
              : "Digite sua mensagem... (Enter para enviar, Shift+Enter para quebrar linha)"
          }
          disabled={disabled}
          rows={1}
          className="flex-1 bg-bg-card border border-border-strong rounded-lg px-4 py-2.5 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50 resize-none overflow-y-auto"
          style={{ minHeight: "42px", maxHeight: "128px" }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="bg-brand-500 text-white rounded-lg p-2.5 hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
