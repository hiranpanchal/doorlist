import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.payment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@doorlist.co.uk",
      phone: "07700 000000",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  const landlordHash = await bcrypt.hash("landlord123", 12);
  const landlord = await prisma.user.create({
    data: {
      name: "James Whitaker",
      email: "james@landlord.co.uk",
      phone: "07700 900456",
      passwordHash: landlordHash,
      role: "landlord",
    },
  });

  console.log(`Created admin: ${admin.email}`);
  console.log(`Created landlord: ${landlord.email} (password: landlord123)`);

  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 30);

  const properties = [
    {
      title: "Modern 2 Bed Apartment in City Centre",
      description: "A stunning modern apartment in the heart of Manchester city centre. Open plan living with floor-to-ceiling windows offering panoramic city views.",
      propertyType: "flat", address: "14 Deansgate Square", city: "Manchester", county: "Greater Manchester", postcode: "M15 4TN",
      price: 1250, bedrooms: 2, bathrooms: 1, furnished: "furnished",
      petFriendly: false, dssAccepted: false, parking: true, garden: false, fireplace: false,
      studentFriendly: false, familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
      deposit: 1442, minTenancy: 12, epc: "B",
      availableFrom: "2026-07-01", images: "", featured: true,
      status: "active", paidAt: now, expiresAt: expires, userId: landlord.id,
      landlordName: landlord.name, landlordEmail: landlord.email, landlordPhone: landlord.phone,
    },
    {
      title: "Charming 3 Bed Victorian Terrace",
      description: "A beautifully renovated Victorian terrace house retaining original period features throughout.",
      propertyType: "house", address: "42 Beech Road", city: "Manchester", county: "Greater Manchester", postcode: "M21 9EL",
      price: 1450, bedrooms: 3, bathrooms: 1, furnished: "unfurnished",
      petFriendly: true, dssAccepted: true, parking: false, garden: true, fireplace: true,
      studentFriendly: false, familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
      deposit: 1673, minTenancy: 12, epc: "D",
      availableFrom: "2026-06-15", images: "", featured: true,
      status: "active", paidAt: now, expiresAt: expires, userId: landlord.id,
      landlordName: landlord.name, landlordEmail: landlord.email, landlordPhone: landlord.phone,
    },
    {
      title: "Spacious 1 Bed Flat with Balcony",
      description: "A bright and airy one bedroom apartment on the third floor with a private south-facing balcony.",
      propertyType: "flat", address: "7 MediaCity Way", city: "Salford", county: "Greater Manchester", postcode: "M50 2EQ",
      price: 950, bedrooms: 1, bathrooms: 1, furnished: "furnished",
      petFriendly: false, dssAccepted: false, parking: true, garden: false, fireplace: false,
      studentFriendly: true, familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
      deposit: 1096, minTenancy: 6, epc: "B",
      availableFrom: "2026-07-15", images: "", featured: true,
      status: "active", paidAt: now, expiresAt: expires, userId: landlord.id,
      landlordName: landlord.name, landlordEmail: landlord.email, landlordPhone: landlord.phone,
    },
    {
      title: "4 Bed Detached Family Home",
      description: "An impressive four bedroom detached family home set within a quiet cul-de-sac.",
      propertyType: "house", address: "8 Oakwood Drive", city: "Altrincham", county: "Greater Manchester", postcode: "WA15 8QT",
      price: 2100, bedrooms: 4, bathrooms: 2, furnished: "unfurnished",
      petFriendly: true, dssAccepted: false, parking: true, garden: true, fireplace: true,
      studentFriendly: false, familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
      deposit: 2423, minTenancy: 12, epc: "C",
      availableFrom: "2026-08-01", images: "", featured: true,
      status: "active", paidAt: now, expiresAt: expires, userId: landlord.id,
      landlordName: landlord.name, landlordEmail: landlord.email, landlordPhone: landlord.phone,
    },
    {
      title: "Luxury 2 Bed Penthouse with Terrace",
      description: "A spectacular two bedroom penthouse offering luxurious city living.",
      propertyType: "flat", address: "1 St Peter's Square", city: "Manchester", county: "Greater Manchester", postcode: "M2 3AE",
      price: 2800, bedrooms: 2, bathrooms: 2, furnished: "furnished",
      petFriendly: true, dssAccepted: false, parking: true, garden: false, fireplace: true,
      studentFriendly: false, familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
      deposit: 3230, minTenancy: 12, epc: "A",
      availableFrom: "2026-09-01", images: "", featured: true,
      status: "active", paidAt: now, expiresAt: expires, userId: landlord.id,
      landlordName: landlord.name, landlordEmail: landlord.email, landlordPhone: landlord.phone,
    },
    {
      title: "Converted Warehouse 2 Bed Loft",
      description: "A unique two bedroom loft apartment in a converted Victorian warehouse in the Northern Quarter.",
      propertyType: "flat", address: "55 Tib Street", city: "Manchester", county: "Greater Manchester", postcode: "M4 1LG",
      price: 1600, bedrooms: 2, bathrooms: 1, furnished: "furnished",
      petFriendly: false, dssAccepted: false, parking: false, garden: false, fireplace: false,
      studentFriendly: false, familiesAllowed: true, smokersAllowed: false, billsIncluded: false,
      deposit: 1846, minTenancy: 12, epc: "C",
      availableFrom: "2026-06-25", images: "", featured: true,
      status: "active", paidAt: now, expiresAt: expires, userId: landlord.id,
      landlordName: landlord.name, landlordEmail: landlord.email, landlordPhone: landlord.phone,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({ data: property });
  }
  console.log(`Seeded ${properties.length} properties (all active, owned by ${landlord.email})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
