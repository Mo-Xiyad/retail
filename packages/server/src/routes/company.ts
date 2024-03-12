import { company as companyTable } from '@repo/database/company';
import { users as usersTable } from '@repo/database/user';
import { TRPCError } from '@trpc/server';
import { eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { protectedProcedure, router } from '../router';

export const companyRouter = router({
  createCompany: protectedProcedure
    .input(
      z.object({
        companyName: z.string(),
        orgId: z.string()
      })
    )
    .mutation(async ({ input, ctx: { db, user } }) => {
      try {
        const { companyName, orgId } = input;
        let hasCompanyCreated = false;
        await db.transaction(async (db) => {
          const existingCompany = await db
            .select()
            .from(companyTable)
            .where(
              or(
                eq(companyTable.name, companyName),
                eq(companyTable.orgId, orgId)
              )
            )
            .execute();

          if (existingCompany.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A company with the same name or domain already exists'
            });
          }
          await db
            .insert(companyTable)
            .values({
              name: companyName,
              orgId: orgId,
              createdBy: 'user_2cgHaFqhtpXES1DcFSko13Fkrza'
            })
            .execute();
          hasCompanyCreated = true;
        });
        return { success: hasCompanyCreated };
      } catch (error) {
        console.log('error', error);

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
          orgId: companyTable.orgId,
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
  })
});
