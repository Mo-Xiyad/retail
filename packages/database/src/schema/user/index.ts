import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: varchar('user_id', { length: 64 }).primaryKey(), //This is clerkId
    email: varchar('email', { length: 64 }).unique().notNull(),
    name: varchar('name', { length: 64 }).notNull(),
    firstName: varchar(' first_name', { length: 64 }).notNull(),
    lastName: varchar(' last_name', { length: 64 }).notNull(),
    onboarded: boolean('onboarded').default(false).notNull(),
    companyId: int('company_id').notNull(),
    roleId: int('role_id'),
    departmentId: int('department_id'),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => ({
    Idx: index('users_idx').on(table.id),
    companyIdx: index('users_company_idx').on(table.companyId),
    roleIdx: index('users_role_idx').on(table.roleId),
    departmentIdx: index('users_department_idx').on(table.departmentId)
  })
);
export const test = mysqlTable(
  'test',
  {
    id: varchar('user_id', { length: 64 }).primaryKey(), //This is clerkId
    name: varchar('name', { length: 64 }).notNull()
  },
  (table) => ({
    Idx: index('users_idx').on(table.id)
  })
);
