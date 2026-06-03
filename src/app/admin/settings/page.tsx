"use client";

import { useState, useEffect } from "react";
import { Key, AlertCircle, CheckCircle, Shield, CreditCard } from "lucide-react";

export default function AdminSettingsPage() {
  const [secretKey, setSecretKey] = useState("");
  const [publishableKey, setPublishableKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [stripeMode, setStripeMode] = useState<"mock" | "test" | "live">("mock");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.stripe_secret_key) setSecretKey(data.stripe_secret_key);
        if (data.stripe_publishable_key) setPublishableKey(data.stripe_publishable_key);
        if (data.stripe_webhook_secret) setWebhookSecret(data.stripe_webhook_secret);
        if (data.stripe_mode) setStripeMode(data.stripe_mode);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const mode = secretKey.startsWith("sk_live_")
      ? "live"
      : secretKey.startsWith("sk_test_")
        ? "test"
        : "mock";

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stripe_secret_key: secretKey,
        stripe_publishable_key: publishableKey,
        stripe_webhook_secret: webhookSecret,
        stripe_mode: mode,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setStatus("saved");
      setStripeMode(mode);
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <div className="max-w-2xl">
      {/* Stripe Status */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            stripeMode === "live"
              ? "bg-emerald-50"
              : stripeMode === "test"
                ? "bg-yellow-50"
                : "bg-gray-100"
          }`}>
            <CreditCard className={`w-5 h-5 ${
              stripeMode === "live"
                ? "text-emerald-600"
                : stripeMode === "test"
                  ? "text-yellow-600"
                  : "text-gray-400"
            }`} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              Stripe Payment Gateway
            </p>
            <p className="text-sm text-muted">
              {stripeMode === "live" && "Live mode — real payments are being processed"}
              {stripeMode === "test" && "Test mode — using Stripe test environment"}
              {stripeMode === "mock" && "Mock mode — payments are simulated (no Stripe keys configured)"}
            </p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
            stripeMode === "live"
              ? "bg-emerald-50 text-emerald-700"
              : stripeMode === "test"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-gray-100 text-gray-500"
          }`}>
            {stripeMode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* API Keys Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-gray-900">Stripe API Keys</h2>
        </div>

        {status === "saved" && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Settings saved successfully
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Failed to save settings
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Secret Key
          </label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className={inputClass}
            placeholder="sk_test_... or sk_live_..."
          />
          <p className="text-xs text-muted mt-1">
            Found in your Stripe Dashboard → Developers → API Keys
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Publishable Key
          </label>
          <input
            type="text"
            value={publishableKey}
            onChange={(e) => setPublishableKey(e.target.value)}
            className={inputClass}
            placeholder="pk_test_... or pk_live_..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Webhook Secret
          </label>
          <input
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            className={inputClass}
            placeholder="whsec_..."
          />
          <p className="text-xs text-muted mt-1">
            Required for verifying Stripe webhook events
          </p>
        </div>

        <div className="flex items-start gap-2 bg-surface rounded-lg p-3">
          <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted">
            Keys are stored securely in the database and used server-side only.
            Leave fields empty to use mock/simulated payment mode.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Stripe Settings"}
        </button>
      </form>
    </div>
  );
}
