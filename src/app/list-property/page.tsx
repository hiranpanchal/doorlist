"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, CheckCircle } from "lucide-react";

export default function ListPropertyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, unknown> = {};
    const intFields = ["price", "bedrooms", "bathrooms", "deposit", "minTenancy"];
    const boolFields = [
      "petFriendly", "dssAccepted", "parking", "garden", "fireplace",
      "studentFriendly", "familiesAllowed", "smokersAllowed", "billsIncluded",
    ];

    formData.forEach((value, key) => {
      if (intFields.includes(key)) {
        data[key] = parseInt(value as string) || 0;
      } else if (!boolFields.includes(key)) {
        data[key] = value;
      }
    });

    for (const field of boolFields) {
      data[field] = formData.has(field);
    }

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { id } = await res.json();
        router.push(`/payment/${id}`);
        return;
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-border p-10 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Listed!
          </h1>
          <p className="text-sm text-muted">
            Your property has been successfully listed on Door List.
            Redirecting to search...
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Home className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            List Your Property
          </h1>
          <p className="text-muted mt-2">
            List your property for just &pound;29.99 for 30 days
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-border p-6 sm:p-8 space-y-8"
        >
          {/* Property Details */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">
              Property Details
            </legend>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Property Title</label>
                <input
                  name="title"
                  required
                  className={inputClass}
                  placeholder="e.g. Modern 2 Bed Apartment in City Centre"
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your property, including key features and nearby amenities..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select name="propertyType" required className={inputClass}>
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="room">Room</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Monthly Rent (&pound;)
                  </label>
                  <input
                    name="price"
                    type="number"
                    required
                    min="0"
                    className={inputClass}
                    placeholder="e.g. 1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <select name="bedrooms" required className={inputClass}>
                    <option value="0">Studio</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <select name="bathrooms" required className={inputClass}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Furnished</label>
                  <select name="furnished" required className={inputClass}>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="furnished">Furnished</option>
                    <option value="part-furnished">Part Furnished</option>
                  </select>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Address */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">
              Address
            </legend>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Street Address</label>
                <input
                  name="address"
                  required
                  className={inputClass}
                  placeholder="e.g. 14 Deansgate Square"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    name="city"
                    required
                    className={inputClass}
                    placeholder="e.g. Manchester"
                  />
                </div>
                <div>
                  <label className={labelClass}>County</label>
                  <input
                    name="county"
                    required
                    className={inputClass}
                    placeholder="e.g. Greater Manchester"
                  />
                </div>
                <div>
                  <label className={labelClass}>Postcode</label>
                  <input
                    name="postcode"
                    required
                    className={inputClass}
                    placeholder="e.g. M15 4TN"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Price & Availability */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">
              Price &amp; Availability
            </legend>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Deposit (&pound;)</label>
                  <input
                    name="deposit"
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="e.g. 1200"
                  />
                </div>
                <div>
                  <label className={labelClass}>Available From</label>
                  <input
                    name="availableFrom"
                    type="date"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Min Tenancy (months)</label>
                  <select name="minTenancy" defaultValue="6" className={inputClass}>
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="billsIncluded"
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                Bills Included in Rent
              </label>
            </div>
          </fieldset>

          {/* Features */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </legend>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>EPC Rating</label>
                  <select name="epc" defaultValue="C" className={inputClass}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { name: "parking", label: "Parking" },
                  { name: "garden", label: "Garden" },
                  { name: "fireplace", label: "Fireplace" },
                ].map((item) => (
                  <label
                    key={item.name}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={item.name}
                      className="rounded border-border text-primary focus:ring-primary/20"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Tenant Preferences */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">
              Tenant Preferences
            </legend>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                { name: "petFriendly", label: "Pets Allowed" },
                { name: "smokersAllowed", label: "Smokers Allowed" },
                { name: "dssAccepted", label: "DSS / LHA Accepted" },
                { name: "studentFriendly", label: "Student Friendly" },
                { name: "familiesAllowed", label: "Families Allowed", defaultChecked: true },
              ].map((item) => (
                <label
                  key={item.name}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={item.name}
                    defaultChecked={item.defaultChecked}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
            >
              {submitting ? "Creating listing..." : "Continue to Payment — £29.99"}
            </button>
            <p className="text-xs text-muted text-center mt-3">
              Your listing will go live once payment is confirmed. Contact details are taken from your profile.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
