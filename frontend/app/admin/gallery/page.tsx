"use client";

import { useState } from "react";

export default function AdminGalleryPage() {
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState<{ url: string; type: string }[]>([]);
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.set("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();

      if (res.ok) {
        setMedia((prev) => [{ url: result.url, type: result.type || "image" }, ...prev]);
        setMessage(`Uploaded: ${result.filename}`);
        fileInput.value = "";
      } else {
        setMessage(result.error || "Upload failed");
      }
    } catch {
      setMessage("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-heading">
        Gallery Upload
      </h1>

      <form onSubmit={handleUpload} className="mb-8 max-w-md">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-heading">
            Choose an image or video (max 50MB)
          </label>
          <input
            type="file"
            name="file"
            accept="image/*,video/mp4,video/webm"
            required
            className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent-dark"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && (
          <p className="mt-2 text-sm text-muted">{message}</p>
        )}
      </form>

      {media.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item.url} className="overflow-hidden rounded-lg border border-line">
              <div className="aspect-[4/3] bg-fill flex items-center justify-center text-xs text-subtle">
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-muted">{item.url}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {media.length === 0 && (
        <p className="py-10 text-center text-sm text-subtle">
          No uploaded media yet.
        </p>
      )}
    </div>
  );
}
