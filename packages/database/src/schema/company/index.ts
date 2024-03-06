import {
  index,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const company = mysqlTable(
  'company',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique(),
    domain: varchar('domain', { length: 64 }).unique(),
    createdBy: varchar('created_by', { length: 64 }), // userId
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    Idx: index('company_idx').on(table.id),
  })
);
export const department = mysqlTable(
  'department',
  {
    id: serial('id').primaryKey(),
    companyId: int('company_id').notNull(),
    name: varchar('name', { length: 255 }),
  },
  (table) => ({
    Idx: index('department_idx').on(table.id),
    companyIdx: index('department_company_idx').on(table.companyId),
  })
);
export const role = mysqlTable(
  'role',
  {
    id: serial('id').primaryKey(),
    companyId: int('company_id').notNull(),
    name: varchar('name', { length: 255 }),
  },
  (table) => ({
    Idx: index('role_idx').on(table.id),
    companyIdx: index('department_company_idx').on(table.companyId),
  })
);
