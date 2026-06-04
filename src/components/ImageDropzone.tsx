"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ImageDropzone({
  value,
  settingKey,
  onUploaded,
}: {
  value: string;
  settingKey: string;
  onUploaded: (url: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be under 2MB");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", settingKey);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          onUploaded(data.url);
        } else {
          setError(data.error || "Upload failed");
        }
      } catch {
        setError("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [settingKey, onUploaded]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    onUploaded("");
    if (inputRef.current) inputRef.current.value = "";
  }

  if (value) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border">
        <img
          src={value}
          alt="Hero background"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs text-white/80 font-medium">
            Hero background image
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-white text-xs font-medium hover:bg-white/30 transition-colors"
            >
              Replace
            </button>
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-white/20 backdrop-blur text-white hover:bg-red-500/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
          dragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-border-2 hover:bg-surface"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <span className="text-sm text-muted">Uploading...</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">
                Drop an image here, or{" "}
                <span className="text-accent">browse</span>
              </p>
              <p className="text-xs text-muted mt-1">
                PNG, JPG, or WebP &middot; Max 2MB
              </p>
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
