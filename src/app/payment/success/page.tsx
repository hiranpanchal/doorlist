import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-border p-10 text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-muted mb-6">
          Your property is now live on Door List for 30 days. Tenants can find
          and enquire about your listing immediately.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/properties"
            className="text-sm text-primary hover:underline"
          >
            View all properties
          </Link>
        </div>
      </div>
    </div>
  );
}
