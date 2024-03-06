import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

export default {
  schema: './src/schema/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL
  }
} satisfies Config;
