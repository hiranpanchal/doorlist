"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

const FIELD_CONFIG: Record<string, { label: string; type: string; placeholder: string; rows?: number }> = {
  name: { label: "Full Name", type: "text", placeholder: "Your name" },
  email: { label: "Email Address", type: "email", placeholder: "you@email.com" },
  phone: { label: "Phone Number", type: "tel", placeholder: "07700 000000" },
  subject: { label: "Subject", type: "text", placeholder: "What's this about?" },
  message: { label: "Message", type: "textarea", placeholder: "How can we help?", rows: 5 },
  company: { label: "Company Name", type: "text", placeholder: "Your company" },
  property_ref: { label: "Property Reference", type: "text", placeholder: "e.g. ABC123" },
};

export default function ContactForm({ fields }: { fields: string[] }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    setSent(true);
  }

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  if (sent) {
    return (
      <div className="bg-surface rounded-2xl p-10 text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--color-success)" }} />
        <h3
          className="text-xl font-bold text-ink mb-2"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          Message Sent!
        </h3>
        <p className="text-sm text-muted">We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((fieldKey) => {
        const config = FIELD_CONFIG[fieldKey];
        if (!config) return null;

        const isRequired = fieldKey === "name" || fieldKey === "email" || fieldKey === "message";

        if (config.type === "textarea") {
          return (
            <div key={fieldKey}>
              <label className="block text-sm font-medium text-ink mb-1.5">
                {config.label} {isRequired && <span className="text-red-400">*</span>}
              </label>
              <textarea
                value={form[fieldKey] || ""}
                onChange={(e) => update(fieldKey, e.target.value)}
                required={isRequired}
                rows={config.rows || 4}
                className={`${inputClass} resize-none`}
                placeholder={config.placeholder}
              />
            </div>
          );
        }

        return (
          <div key={fieldKey}>
            <label className="block text-sm font-medium text-ink mb-1.5">
              {config.label} {isRequired && <span className="text-red-400">*</span>}
            </label>
            <input
              type={config.type}
              value={form[fieldKey] || ""}
              onChange={(e) => update(fieldKey, e.target.value)}
              required={isRequired}
              className={inputClass}
              placeholder={config.placeholder}
            />
          </div>
        );
      })}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
        style={{ background: "var(--color-ink)" }}
      >
        <Send className="w-4 h-4" />
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
