import {
  index,
  mysqlTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';

export const company = mysqlTable(
  'company',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique(),
    orgId: varchar('domain', { length: 64 }).unique(),
    createdBy: varchar('created_by', { length: 64 }), // userId
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => ({
    Idx: index('company_idx').on(table.id)
  })
);
