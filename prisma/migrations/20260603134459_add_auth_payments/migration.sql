-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'landlord',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 2999,
    "currency" TEXT NOT NULL DEFAULT 'gbp',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "stripeSessionId" TEXT,
    "paidAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "furnished" TEXT NOT NULL DEFAULT 'unfurnished',
    "petFriendly" BOOLEAN NOT NULL DEFAULT false,
    "dssAccepted" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "garden" BOOLEAN NOT NULL DEFAULT false,
    "fireplace" BOOLEAN NOT NULL DEFAULT false,
    "studentFriendly" BOOLEAN NOT NULL DEFAULT false,
    "familiesAllowed" BOOLEAN NOT NULL DEFAULT true,
    "smokersAllowed" BOOLEAN NOT NULL DEFAULT false,
    "billsIncluded" BOOLEAN NOT NULL DEFAULT false,
    "deposit" INTEGER NOT NULL DEFAULT 0,
    "minTenancy" INTEGER NOT NULL DEFAULT 6,
    "epc" TEXT NOT NULL DEFAULT 'C',
    "availableFrom" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "landlordName" TEXT NOT NULL,
    "landlordEmail" TEXT NOT NULL,
    "landlordPhone" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "views" INTEGER NOT NULL DEFAULT 0,
    "paidAt" DATETIME,
    "expiresAt" DATETIME,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "availableFrom", "bathrooms", "bedrooms", "billsIncluded", "city", "county", "createdAt", "deposit", "description", "dssAccepted", "epc", "familiesAllowed", "featured", "fireplace", "furnished", "garden", "id", "images", "landlordEmail", "landlordName", "landlordPhone", "minTenancy", "parking", "petFriendly", "postcode", "price", "propertyType", "smokersAllowed", "status", "studentFriendly", "title", "updatedAt") SELECT "address", "availableFrom", "bathrooms", "bedrooms", "billsIncluded", "city", "county", "createdAt", "deposit", "description", "dssAccepted", "epc", "familiesAllowed", "featured", "fireplace", "furnished", "garden", "id", "images", "landlordEmail", "landlordName", "landlordPhone", "minTenancy", "parking", "petFriendly", "postcode", "price", "propertyType", "smokersAllowed", "status", "studentFriendly", "title", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
