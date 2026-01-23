


import "dotenv/config";
import { defineConfig } from "@prisma/config";

// কাস্টম config ফাইল ইম্পোর্ট করবেন না, কারণ Prisma CLI এটি রিড করতে পারছে না
export default defineConfig({
  schema: "./prisma/schema",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
