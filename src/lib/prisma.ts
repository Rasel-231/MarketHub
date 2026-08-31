// Re-export from the canonical shared prisma instance so that
// modules under src/{queues,routes,lib} can import via `../lib/prisma`.
export { prisma } from "../app/shared/prisma";
