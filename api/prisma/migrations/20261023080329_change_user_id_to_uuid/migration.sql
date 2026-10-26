-- AlterTable: Safely migrate id, createdById, and updatedById from INTEGER to UUID while preserving data and relationships

-- 1. Add temporary UUID columns
ALTER TABLE "User" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "User" ADD COLUMN "new_createdById" UUID;
ALTER TABLE "User" ADD COLUMN "new_updatedById" UUID;

-- 2. Populate new_id for existing records
UPDATE "User" SET "new_id" = gen_random_uuid() WHERE "new_id" IS NULL;

-- 3. Remap self-referencing foreign keys to the new UUIDs
UPDATE "User" u
SET "new_createdById" = creator."new_id"
FROM "User" creator
WHERE u."createdById" = creator."id";

UPDATE "User" u
SET "new_updatedById" = updater."new_id"
FROM "User" updater
WHERE u."updatedById" = updater."id";

-- 4. Drop old foreign keys and primary key constraint
ALTER TABLE "User" DROP CONSTRAINT "User_createdById_fkey";
ALTER TABLE "User" DROP CONSTRAINT "User_updatedById_fkey";
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";

-- 5. Drop old integer columns (this also drops the owned sequence User_id_seq)
ALTER TABLE "User" DROP COLUMN "id";
ALTER TABLE "User" DROP COLUMN "createdById";
ALTER TABLE "User" DROP COLUMN "updatedById";

-- 6. Rename new UUID columns to their canonical names
ALTER TABLE "User" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "User" RENAME COLUMN "new_createdById" TO "createdById";
ALTER TABLE "User" RENAME COLUMN "new_updatedById" TO "updatedById";

-- 7. Ensure id is NOT NULL and remove database default so Prisma Client manages UUID generation
ALTER TABLE "User" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;

-- 8. Recreate primary key constraint
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- 9. Recreate self-referencing foreign key constraints
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "User" ADD CONSTRAINT "User_updatedById_fkey"
FOREIGN KEY ("updatedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
