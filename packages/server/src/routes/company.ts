import {
  company as companyTable,
  department as departmentTable,
  role as roleTable
} from '@repo/database/company';
import { users as usersTable } from '@repo/database/user';
import { TRPCError } from '@trpc/server';
import { eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, router } from '../router';

export const companyRouter = router({
  createCompany: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        domain: z.string(),
        roles: z.array(z.string()), // Array of role names
        departments: z.array(z.string()) // Array of department names
      })
    )
    .mutation(async ({ input, ctx: { db, user } }) => {
      try {
        const { name, domain, roles, departments } = input;
        let hasCompanyCreated = false;
        await db.transaction(async (db) => {
          const existingCompany = await db
            .select()
            .from(companyTable)
            .where(
              or(eq(companyTable.name, name), eq(companyTable.domain, domain))
            )
            .execute();

          if (existingCompany.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A company with the same name or domain already exists'
            });
          }
          const { insertId: newCompanyId } = await db
            .insert(companyTable)
            .values({
              name: name,
              domain: domain,
              createdBy: 'user_2YV0Q6CMlqlUZ9q5MsSyaPU9rKZ'
            })
            .execute();
          for (const roleName of roles) {
            await db
              .insert(roleTable)
              .values({
                companyId: parseInt(newCompanyId),
                name: roleName
              })
              .execute();
          }

          // Insert departments
          for (const departmentName of departments) {
            await db
              .insert(departmentTable)
              .values({
                companyId: parseInt(newCompanyId),
                name: departmentName
              })
              .execute();
          }
          hasCompanyCreated = true;
        });
        return { success: hasCompanyCreated };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create company'
          });
        }
      }
    }),
  getAllCompanies: protectedProcedure.query(async ({ ctx: { db } }) => {
    try {
      const userSubquery = db
        .select({
          userId: usersTable.id,
          userName: usersTable.name
        })
        .from(usersTable)
        .as('userSubquery');

      const companies = await db
        .select({
          id: companyTable.id,
          name: companyTable.name,
          domain: companyTable.domain,
          createdBy: userSubquery.userName
        })
        .from(companyTable)
        .leftJoin(userSubquery, eq(userSubquery.userId, companyTable.createdBy))
        .execute();

      return companies;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get all companies'
        });
      }
    }
  }),
  getCompanyDetails: protectedProcedure
    .input(
      z.object({
        companyId: z.number()
      })
    )
    .query(async ({ ctx: { db }, input }) => {
      const { companyId } = input;

      try {
        const company = await db
          .select()
          .from(companyTable)
          .where(eq(companyTable.id, companyId))
          .execute();

        if (company.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Company not found'
          });
        }

        const roles = await db
          .select({
            id: roleTable.id,
            name: roleTable.name
          })
          .from(roleTable)
          .where(eq(roleTable.companyId, companyId))
          .execute();

        const departments = await db
          .select({
            id: departmentTable.id,
            name: departmentTable.name
          })
          .from(departmentTable)
          .where(eq(departmentTable.companyId, companyId))
          .execute();

        return {
          company: company[0],
          roles,
          departments
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get company details'
          });
        }
      }
    }),
  getCompaniesNamesAndIds: protectedProcedure.query(async ({ ctx: { db } }) => {
    try {
      const companies = await db
        .select({
          id: companyTable.id,
          name: companyTable.name
        })
        .from(companyTable)
        .execute();

      return companies;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get companies'
        });
      }
    }
  })
});
