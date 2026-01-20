


import "dotenv/config";
import { defineConfig } from "@prisma/config";

// কাস্টম config ফাইল ইম্পোর্ট করবেন না, কারণ Prisma CLI এটি রিড করতে পারছে না
export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    // সরাসরি .env ফাইল থেকে DATABASE_URL টি নিন
    url: process.env.DATABASE_URL,
  },
});
