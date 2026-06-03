import Link from "next/link";
import { CheckCircle, PoundSterling, Clock, Shield, Users, Zap } from "lucide-react";

export default function PricingPage() {
  return (
    <>
      <section className="hero-gradient text-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, Affordable Pricing
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            One price. No hidden fees. No commission. Just a straightforward way
            to find great tenants.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-primary shadow-lg overflow-hidden">
            <div className="bg-primary text-white text-center py-3">
              <span className="text-sm font-semibold tracking-wide uppercase">
                Property Listing
              </span>
            </div>

            <div className="p-8 text-center">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold text-primary-dark">
                  &pound;29.99
                </span>
              </div>
              <p className="text-muted text-sm">
                per listing &middot; 30 days
              </p>

              <div className="mt-8 space-y-4 text-left">
                {[
                  "Your property listed for 30 days",
                  "Direct enquiries from tenants",
                  "Landlord dashboard to manage listings",
                  "Track property views and interest",
                  "Edit your listing anytime",
                  "Renew with one click when it expires",
                  "No agency commission on tenancy",
                  "No auto-renewal — you're in control",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="block w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-lg transition-colors text-lg mt-8"
              >
                Get Started
              </Link>
              <p className="text-xs text-muted mt-3">
                Create an account, list your property, and pay — it&apos;s that simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Why Landlords Choose Door List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: PoundSterling, title: "No Commission", desc: "Keep 100% of your rental income. We never take a cut." },
              { icon: Zap, title: "Live in Minutes", desc: "Fill in the form, pay, and your listing goes live instantly." },
              { icon: Clock, title: "No Lock-In", desc: "30-day listings with no auto-renewal. Renew only if you want to." },
              { icon: Users, title: "Direct Contact", desc: "Tenants message you directly. No middleman, no delays." },
              { icon: Shield, title: "You're in Control", desc: "Edit, pause, or remove your listing anytime from your dashboard." },
              { icon: CheckCircle, title: "Transparent", desc: "£29.99 is all you pay. No setup fees, no hidden charges." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-border p-5">
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
