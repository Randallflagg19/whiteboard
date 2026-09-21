-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('AVAILABLE', 'WAITING', 'SOMEDAY', 'DONE');

-- CreateEnum
CREATE TYPE "StreakResult" AS ENUM ('SUCCESS', 'MISSED');

-- CreateTable
CREATE TABLE "BoardBlock" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "emoji" TEXT,
    "dueDate" DATE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isInbox" BOOLEAN NOT NULL DEFAULT false,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "availableFrom" DATE,
    "scheduledFor" DATE,
    "dueDate" DATE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blockId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "BlockNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "title" TEXT,
    "showTitle" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreakEntry" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "result" "StreakResult" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "streakId" TEXT NOT NULL,

    CONSTRAINT "StreakEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreakEntry_streakId_date_key" ON "StreakEntry"("streakId", "date");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "BoardBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockNote" ADD CONSTRAINT "BlockNote_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "BoardBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreakEntry" ADD CONSTRAINT "StreakEntry_streakId_fkey" FOREIGN KEY ("streakId") REFERENCES "Streak"("id") ON DELETE CASCADE ON UPDATE CASCADE;
