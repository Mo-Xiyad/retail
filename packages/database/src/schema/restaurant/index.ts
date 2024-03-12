import {
  boolean,
  index,
  mysqlTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/mysql-core';

export const restaurant = mysqlTable(
  'restaurant',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique(),
    subdomain: varchar('subdomain', { length: 64 }).unique(),
    description: varchar('description', { length: 255 }),
    address: varchar('address', { length: 255 }),
    zipCode: varchar('zip_code', { length: 64 }),
    city: varchar('city', { length: 64 }),
    isDeleted: boolean('is_deleted').default(false),
    phoneNumber: varchar('phone_number', { length: 64 }),
    companyId: varchar('company_id', { length: 64 }),
    imageId: varchar('image_id', { length: 64 }),
    createdBy: varchar('created_by', { length: 64 }), // userId
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => ({
    Idx: index('restaurant_idx').on(table.id)
  })
);
