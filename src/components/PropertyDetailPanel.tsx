import {
  PoundSterling, Receipt, Wifi, Calendar, Clock,
  GraduationCap, Users, PawPrint, Cigarette, HandCoins,
  Trees, Car, Flame, Home, Zap,
} from "lucide-react";

type Property = {
  price: number;
  deposit: number;
  billsIncluded: boolean;
  furnished: string;
  epc: string;
  availableFrom: string;
  minTenancy: number;
  studentFriendly: boolean;
  familiesAllowed: boolean;
  petFriendly: boolean;
  smokersAllowed: boolean;
  dssAccepted: boolean;
  garden: boolean;
  parking: boolean;
  fireplace: boolean;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
};

function BooleanIndicator({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-400">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  isBool,
  boolValue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  isBool?: boolean;
  boolValue?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-primary/60" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      {isBool ? (
        <BooleanIndicator value={boolValue ?? false} />
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-transparent px-5 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-primary-dark tracking-wide uppercase">
          {title}
        </h3>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

export default function PropertyDetailPanel({ property }: { property: Property }) {
  const typeLabel =
    property.propertyType === "flat"
      ? "Flat / Apartment"
      : property.propertyType === "house"
        ? "House"
        : property.propertyType === "room"
          ? "Room"
          : "Property";

  const epcColors: Record<string, string> = {
    A: "bg-emerald-500",
    B: "bg-emerald-400",
    C: "bg-yellow-400",
    D: "bg-orange-400",
    E: "bg-red-400",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Price & Bills */}
      <SectionCard title="Price & Bills">
        <DetailRow
          icon={PoundSterling}
          label="Rent PCM"
          value={`£${property.price.toLocaleString()}.00`}
        />
        <DetailRow
          icon={HandCoins}
          label="Deposit"
          value={property.deposit > 0 ? `£${property.deposit.toLocaleString()}.00` : "None"}
        />
        <DetailRow
          icon={Receipt}
          label="Bills Included"
          isBool
          boolValue={property.billsIncluded}
        />
        <DetailRow
          icon={Wifi}
          label="Broadband"
          value="Check availability"
        />
      </SectionCard>

      {/* Tenant Preferences */}
      <SectionCard title="Tenant Preferences">
        <DetailRow
          icon={GraduationCap}
          label="Student Friendly"
          isBool
          boolValue={property.studentFriendly}
        />
        <DetailRow
          icon={Users}
          label="Families Allowed"
          isBool
          boolValue={property.familiesAllowed}
        />
        <DetailRow
          icon={PawPrint}
          label="Pets Allowed"
          isBool
          boolValue={property.petFriendly}
        />
        <DetailRow
          icon={Cigarette}
          label="Smokers Allowed"
          isBool
          boolValue={property.smokersAllowed}
        />
        <DetailRow
          icon={PoundSterling}
          label="DSS / LHA Accepted"
          isBool
          boolValue={property.dssAccepted}
        />
      </SectionCard>

      {/* Availability */}
      <SectionCard title="Availability">
        <DetailRow
          icon={Calendar}
          label="Available From"
          value={new Date(property.availableFrom).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        />
        <DetailRow
          icon={Clock}
          label="Minimum Tenancy"
          value={`${property.minTenancy} Months`}
        />
      </SectionCard>

      {/* Features */}
      <SectionCard title="Features">
        <DetailRow icon={Trees} label="Garden" isBool boolValue={property.garden} />
        <DetailRow icon={Car} label="Parking" isBool boolValue={property.parking} />
        <DetailRow icon={Flame} label="Fireplace" isBool boolValue={property.fireplace} />
        <DetailRow
          icon={Home}
          label="Furnishing"
          value={property.furnished.charAt(0).toUpperCase() + property.furnished.slice(1)}
        />
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-primary/60" />
            <span className="text-sm text-gray-700">EPC Rating</span>
          </div>
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold ${epcColors[property.epc] || "bg-gray-400"}`}
          >
            {property.epc}
          </span>
        </div>
      </SectionCard>

      {/* Property Overview - full width */}
      <div className="md:col-span-2">
        <SectionCard title="Property Overview">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-dark">
                {property.bedrooms === 0 ? "Studio" : property.bedrooms}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {property.bedrooms === 0 ? "" : property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-dark">{property.bathrooms}</p>
              <p className="text-xs text-muted mt-0.5">
                {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-dark">{typeLabel.split(" ")[0]}</p>
              <p className="text-xs text-muted mt-0.5">Property Type</p>
            </div>
            <div className="text-center">
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-white text-sm font-bold ${epcColors[property.epc] || "bg-gray-400"}`}
              >
                {property.epc}
              </span>
              <p className="text-xs text-muted mt-1.5">EPC Rating</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
