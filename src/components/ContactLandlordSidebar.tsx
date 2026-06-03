"use client";

import { useState } from "react";
import { ChevronRight, Heart, Mail, X, CheckCircle } from "lucide-react";

type Props = {
  propertyId: string;
  propertyTitle: string;
  price: number;
  deposit: number;
  landlordName: string;
  landlordEmail: string;
  landlordCity: string;
  landlordPropertyCount: number;
  landlordUserId: string | null;
  imageCount: number;
  refCode: string;
  views: number;
};

function ContactModal({
  propertyTitle,
  landlordName,
  propertyId,
  onClose,
}: {
  propertyTitle: string;
  landlordName: string;
  propertyId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `Hi ${landlordName.split(" ")[0]}, I'm interested in "${propertyTitle}". Is it still available? I'd love to arrange a viewing.`
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, name, email, phone, message }),
    });

    setSending(false);
    setSent(true);
  }

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2
              className="text-lg font-bold text-ink"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Contact Landlord
            </h2>
            <p className="text-sm text-muted mt-0.5">
              Send an enquiry about {propertyTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "var(--color-success)" }} />
            <h3
              className="text-xl font-bold text-ink mb-2"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Enquiry Sent!
            </h3>
            <p className="text-sm text-muted mb-6">
              Your message has been sent to {landlordName}. They&apos;ll get back
              to you soon.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: "var(--color-ink)" }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Your Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Phone Number
                <span className="text-muted font-normal ml-1">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="07700 000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-50"
              style={{ background: "var(--color-ink)" }}
            >
              <Mail className="w-4 h-4" />
              {sending ? "Sending..." : "Send Enquiry"}
            </button>
            <p className="text-xs text-muted text-center">
              Your details will be shared with the landlord so they can respond.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ContactLandlordSidebar({
  propertyId,
  propertyTitle,
  price,
  deposit,
  landlordName,
  landlordEmail,
  landlordCity,
  landlordPropertyCount,
  landlordUserId,
  imageCount,
  refCode,
  views,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-border p-6 sticky top-24 space-y-6">
        {/* Price */}
        <div className="border-b border-border pb-5">
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl font-bold text-ink"
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              &pound;{price.toLocaleString()}
            </span>
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-muted)", letterSpacing: "0.12em" }}
            >
              Per Month
            </span>
          </div>
          {deposit > 0 && (
            <p className="text-sm text-muted mt-1">
              &pound;{deposit.toLocaleString()} tenancy deposit
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-colors hover:opacity-90"
            style={{ background: "var(--color-ink)" }}
          >
            Contact Landlord <ChevronRight className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-medium text-sm text-ink border border-border hover:bg-surface transition-colors">
            <Heart className="w-4 h-4" /> Save to shortlist
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted pt-2">
          <span>{imageCount} photos</span>
          <span>&middot;</span>
          <span>Ref {refCode}</span>
          <span>&middot;</span>
          <span>{views} views</span>
        </div>
      </div>

      {/* Landlord Profile Card */}
      <div className="bg-white rounded-2xl border border-border p-6 mt-5">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            {landlordName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h3
              className="font-bold text-ink text-base"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              {landlordName}
            </h3>
            <p className="text-sm text-muted">Private Landlord</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5 text-sm text-ink-2">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {landlordCity}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-ink-2">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {landlordPropertyCount} {landlordPropertyCount === 1 ? "property" : "properties"} listed
          </div>
        </div>

        {landlordUserId && (
          <a
            href={`/properties?landlord=${landlordUserId}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium text-sm text-ink border border-border hover:bg-surface transition-colors"
          >
            View other properties
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ContactModal
          propertyTitle={propertyTitle}
          landlordName={landlordName}
          propertyId={propertyId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
