import { Clerk } from '@clerk/clerk-sdk-node';
import {
  company as companyTable,
  department as departmentTable,
  role as roleTable
} from '@repo/database/company';
import { users as usersTable } from '@repo/database/user';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { protectedProcedure, router } from '../router';
import { createOrUpdateClerkUser } from '../utils/user.utils';
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing CLERK_SECRET_KEY');
}
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
export const usersRouter = router({
  getUser: protectedProcedure.query(
    async ({
      input,
      ctx: {
        db,
        user: { id: ctxUserId }
      }
    }) => {
      try {
        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, ctxUserId))
          .execute();
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found'
          });
        }
        return user;
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get user'
          });
        }
      }
    }
  ),
  createUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        companyId: z.number(),
        companyName: z.string(),
        role: z.string(),
        department: z.string(),
        departmentId: z.number(),
        roleId: z.number()
      })
    )
    .mutation(async ({ input, ctx: { db } }) => {
      try {
        const {
          email,
          firstName,
          lastName,
          companyId,
          companyName,
          role,
          department,
          departmentId,
          roleId
        } = input;

        const [existingUser] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .execute();

        if (existingUser) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User already is a part of another company'
          });
        }

        await db.transaction(async (tx) => {
          const clerkUser = await createOrUpdateClerkUser(
            {
              email,
              firstName,
              lastName,
              companyId,
              company: companyName,
              department,
              role,
              onboarded: true,
              permission: []
            },
            'password'
          );

          if (!clerkUser) {
            throw new Error('Could not create user in Clerk');
          }
          const sqlUserData = {
            id: clerkUser.id,
            email,
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            companyId,
            roleId,
            departmentId,
            onboarded: true
          };
          await tx
            .insert(usersTable)
            .values(sqlUserData)
            .onDuplicateKeyUpdate({ set: sqlUserData })
            .execute();
        });
        return { success: true };
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create user'
          });
        }
      }
    }),
  getAllUsers: protectedProcedure.query(async ({ ctx: { db } }) => {
    try {
      const users = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          department: departmentTable.name,
          role: roleTable.name,
          companyName: companyTable.name,
          domain: companyTable.domain,
          joinDate: usersTable.createdAt
        })
        .from(usersTable)
        .leftJoin(
          departmentTable,
          eq(departmentTable.id, usersTable.departmentId)
        )
        .leftJoin(roleTable, eq(roleTable.id, usersTable.roleId))
        .leftJoin(companyTable, eq(companyTable.id, usersTable.companyId))
        .execute();
      return users;
    } catch (error) {
      console.log(error);
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get users'
        });
      }
    }
  })
});

/*
      for (let i = 0; i < 5; i++) {
            const user = {
              email: faker.internet.email(),
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              department: faker.commerce.department()
            };
            const clerkId = await createOrUpdateClerkUser(
              {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId,
                company: companyName,
                department: user.department,
                role,
                onboarded: true,
                permission: []
              },
              'password'
            );
            if (!clerkId) {
              throw new Error('Could not create user in Clerk');
            }
            const sqlUserData = {
              id: clerkId.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              companyId,
              roleId,
              departmentId,
              onboarded: true
            };
            await tx
              .insert(usersTable)
              .values(sqlUserData)
              .onDuplicateKeyUpdate({ set: sqlUserData })
              .execute();
          }
*/
