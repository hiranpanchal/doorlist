"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, GripVertical } from "lucide-react";

export default function PropertyImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB");
        return;
      }

      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          onChange([...images, data.url]);
        } else {
          setError(data.error || "Upload failed");
        }
      } catch {
        setError("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, onChange]
  );

  async function handleFiles(files: FileList) {
    for (let i = 0; i < Math.min(files.length, 10 - images.length); i++) {
      await uploadFile(files[i]);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-xl overflow-hidden border border-border aspect-[4/3] bg-surface"
            >
              <img
                src={url}
                alt={`Property image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {i > 0 && (
                  <button
                    onClick={() => moveImage(i, i - 1)}
                    className="p-1.5 rounded-lg bg-white/90 text-ink text-xs font-medium hover:bg-white"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                <button
                  onClick={() => removeImage(i)}
                  className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
                {i < images.length - 1 && (
                  <button
                    onClick={() => moveImage(i, i + 1)}
                    className="p-1.5 rounded-lg bg-white/90 text-ink text-xs font-medium hover:bg-white"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
              {/* Badge */}
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-ink/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur">
                  Main photo
                </span>
              )}
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur">
                {i + 1}/{images.length}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {images.length < 10 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
            draggingOver
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
                  Drop images here, or <span className="text-accent">browse</span>
                </p>
                <p className="text-xs text-muted mt-1">
                  JPG, PNG, or WebP · Max 5MB each · Up to {10 - images.length} more
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
