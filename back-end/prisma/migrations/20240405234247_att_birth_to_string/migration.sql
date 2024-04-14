-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dataOfBirth" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL
);
INSERT INTO "new_Person" ("dataOfBirth", "gender", "id", "maritalStatus", "name") SELECT "dataOfBirth", "gender", "id", "maritalStatus", "name" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
