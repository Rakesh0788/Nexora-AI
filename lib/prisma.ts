import { PrismaClient } from "@prisma/client";

// ============================================================
// Prisma Client Singleton
//
// In development, Next.js hot-reloading can create multiple
// PrismaClient instances, exhausting DB connections.
// This pattern stores a single instance on the global object.
// ============================================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;