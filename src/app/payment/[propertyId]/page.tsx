"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CreditCard, Shield, Clock, CheckCircle } from "lucide-react";
import { LISTING_PRICE_DISPLAY } from "@/lib/payments";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId as string;
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    setProcessing(true);
    const res = await fetch("/api/payments/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });

    const data = await res.json();
    if (data.url) {
      router.push(data.url);
    }
    setProcessing(false);
  }

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-7 h-7 text-accent-dark" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Your Listing
          </h1>
          <p className="text-muted mt-1">
            One simple payment to go live
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted">Property listing</span>
              <span className="text-sm font-medium text-gray-900">
                30 days
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-primary-dark">
                  &pound;{LISTING_PRICE_DISPLAY}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  One-off payment &middot; No auto-renewal
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface/50 space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              Listed on Door List for 30 days
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              Direct enquiries from tenants
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              Dashboard to manage and track views
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              Renew anytime from your dashboard
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            >
              {processing ? "Processing..." : `Pay £${LISTING_PRICE_DISPLAY}`}
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted">
              <Shield className="w-3.5 h-3.5" />
              Secure payment powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
