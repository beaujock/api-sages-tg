import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Extend globalThis so TypeScript recognizes our custom property
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Export the active instance (falls back to existing global instance if available)
export let prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

/**
 * Tests the database connection.
 * If successful, assigns the PrismaClient instance to the global variable and returns true.
 */
export async function verifyAndSetPrismaConnection(): Promise<boolean> {
  const candidateClient = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

  try {
    // Explicitly initiate the connection
    await candidateClient.$connect();

    // Run a minimal query to verify active read capability
    await candidateClient.$queryRaw`SELECT 1`;

    // Persist to global state and exported binding
    globalForPrisma.prisma = candidateClient;
    prisma = candidateClient;

    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);

    // Clean up the failed client instance to free resources
    await candidateClient.$disconnect().catch(() => {});
    return false;
  }
}