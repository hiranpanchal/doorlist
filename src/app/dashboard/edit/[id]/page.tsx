"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", propertyType: "", address: "", city: "",
    county: "", postcode: "", price: "", bedrooms: "", bathrooms: "",
    furnished: "unfurnished", deposit: "", minTenancy: "6", epc: "C",
    availableFrom: "", petFriendly: false, dssAccepted: false, parking: false,
    garden: false, fireplace: false, studentFriendly: false,
    familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
  });

  useEffect(() => {
    fetch(`/api/properties/${propertyId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            propertyType: data.propertyType || "",
            address: data.address || "",
            city: data.city || "",
            county: data.county || "",
            postcode: data.postcode || "",
            price: data.price?.toString() || "",
            bedrooms: data.bedrooms?.toString() || "",
            bathrooms: data.bathrooms?.toString() || "",
            furnished: data.furnished || "unfurnished",
            deposit: data.deposit?.toString() || "",
            minTenancy: data.minTenancy?.toString() || "6",
            epc: data.epc || "C",
            availableFrom: data.availableFrom || "",
            petFriendly: data.petFriendly || false,
            dssAccepted: data.dssAccepted || false,
            parking: data.parking || false,
            garden: data.garden || false,
            fireplace: data.fireplace || false,
            studentFriendly: data.studentFriendly || false,
            familiesAllowed: data.familiesAllowed ?? true,
            smokersAllowed: data.smokersAllowed || false,
            billsIncluded: data.billsIncluded || false,
          });
        }
        setLoading(false);
      });
  }, [propertyId]);

  function update(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch(`/api/properties/${propertyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseInt(form.price) || 0,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 1,
        deposit: parseInt(form.deposit) || 0,
        minTenancy: parseInt(form.minTenancy) || 6,
      }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/dashboard/listings"), 1500);
  }

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-2 rounded w-48" />
          <div className="h-64 bg-surface-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "var(--color-success)" }} />
          <h1 className="text-xl font-bold text-ink mb-2" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Listing Updated
          </h1>
          <p className="text-sm text-muted">Redirecting to your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/listings"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <h1
        className="text-2xl font-bold text-ink mb-1"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        Edit Listing
      </h1>
      <p className="text-sm text-muted mb-8">Update your property details</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Details */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-ink mb-4" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Property Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} required rows={4} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Type</label>
                <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={inputClass}>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="room">Room</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Rent (£/month)</label>
                <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Deposit (£)</label>
                <input type="number" value={form.deposit} onChange={(e) => update("deposit", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Bedrooms</label>
                <select value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass}>
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? "Studio" : n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <select value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass}>
                  {[1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Furnished</label>
                <select value={form.furnished} onChange={(e) => update("furnished", e.target.value)} className={inputClass}>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="furnished">Furnished</option>
                  <option value="part-furnished">Part Furnished</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>EPC</label>
                <select value={form.epc} onChange={(e) => update("epc", e.target.value)} className={inputClass}>
                  {["A","B","C","D","E"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-ink mb-4" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Address
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Street Address</label>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} required className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input value={form.city} onChange={(e) => update("city", e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>County</label>
                <input value={form.county} onChange={(e) => update("county", e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Postcode</label>
                <input value={form.postcode} onChange={(e) => update("postcode", e.target.value)} required className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Availability & Features */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-bold text-ink mb-4" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
            Availability & Features
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Available From</label>
                <input type="date" value={form.availableFrom} onChange={(e) => update("availableFrom", e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Min Tenancy (months)</label>
                <select value={form.minTenancy} onChange={(e) => update("minTenancy", e.target.value)} className={inputClass}>
                  {[1,3,6,12,24].map(n => <option key={n} value={n}>{n} months</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {[
                { key: "parking", label: "Parking" },
                { key: "garden", label: "Garden" },
                { key: "fireplace", label: "Fireplace" },
                { key: "petFriendly", label: "Pets Allowed" },
                { key: "dssAccepted", label: "DSS / LHA Accepted" },
                { key: "studentFriendly", label: "Student Friendly" },
                { key: "familiesAllowed", label: "Families Allowed" },
                { key: "smokersAllowed", label: "Smokers Allowed" },
                { key: "billsIncluded", label: "Bills Included" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[item.key as keyof typeof form] as boolean}
                    onChange={(e) => update(item.key, e.target.checked)}
                    className="rounded border-border"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-colors"
          style={{ background: "var(--color-ink)" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
