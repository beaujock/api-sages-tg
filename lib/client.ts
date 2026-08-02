import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
// Add prisma to the globalThis object in development to prevent
// multiple instances of PrismaClient being created during hot-reloading
// See: https://www.prisma.io/docs/guides/other/troubleshooting-connections#prisma-client-is-reinstantiated-on-every-hot-reload
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}