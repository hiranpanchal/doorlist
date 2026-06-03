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
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("address", "availableFrom", "bathrooms", "bedrooms", "city", "county", "createdAt", "description", "dssAccepted", "epc", "featured", "furnished", "garden", "id", "images", "landlordEmail", "landlordName", "landlordPhone", "parking", "petFriendly", "postcode", "price", "propertyType", "status", "title", "updatedAt") SELECT "address", "availableFrom", "bathrooms", "bedrooms", "city", "county", "createdAt", "description", "dssAccepted", "epc", "featured", "furnished", "garden", "id", "images", "landlordEmail", "landlordName", "landlordPhone", "parking", "petFriendly", "postcode", "price", "propertyType", "status", "title", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
