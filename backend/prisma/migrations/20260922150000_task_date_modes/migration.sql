ALTER TABLE "Task"
ADD COLUMN "periodStart" DATE,
ADD COLUMN "periodEnd" DATE;

-- A task with both legacy boundaries becomes a period. A lone legacy date
-- becomes its scheduled day; an existing scheduled day takes precedence.
UPDATE "Task"
SET "periodStart" = "availableFrom", "periodEnd" = "dueDate"
WHERE "scheduledFor" IS NULL
  AND "availableFrom" IS NOT NULL
  AND "dueDate" IS NOT NULL;

UPDATE "Task"
SET "scheduledFor" = COALESCE("scheduledFor", "dueDate", "availableFrom")
WHERE "periodStart" IS NULL AND "periodEnd" IS NULL;

ALTER TABLE "Task"
DROP COLUMN "availableFrom",
DROP COLUMN "dueDate";
