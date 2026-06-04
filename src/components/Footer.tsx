import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-white" style={{ background: "#0a1520" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image src="/logo-white.svg" alt="Doorlist" width={140} height={40} />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              The UK&apos;s marketplace for private landlords. List your property or
              find your next home, all in one place.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-4" style={{ letterSpacing: "0.14em" }}>
              For Tenants
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/properties" className="text-sm text-white/50 hover:text-white transition-colors">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-sm text-white/50 hover:text-white transition-colors">
                  Properties by Area
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-4" style={{ letterSpacing: "0.14em" }}>
              For Landlords
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/list-property" className="text-sm text-white/50 hover:text-white transition-colors">
                  List a Property
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-4" style={{ letterSpacing: "0.14em" }}>
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Doorlist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
