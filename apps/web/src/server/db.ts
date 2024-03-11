import { connect } from '@planetscale/database';
import * as companyTables from '@repo/database/company';
import * as userTables from '@repo/database/user';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const connection = await connect({
  host: process.env.PLANETSCALE_DB_HOST,
  password: process.env.PLANETSCALE_DB_PASSWORD,
  username: process.env.PLANETSCALE_DB_USERNAME
});

export const db = drizzle(connection, {
  schema: {
    ...companyTables,
    ...userTables
  }
});
