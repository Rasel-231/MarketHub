import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ১. কানেকশন পুল তৈরি
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ২. অ্যাডাপ্টার তৈরি
const adapter = new PrismaPg(pool);

// ৩. ক্লায়েন্ট এক্সপোর্ট
export const prisma = new PrismaClient({
    adapter,
    log: ["query", "error", "info", "warn"],
});