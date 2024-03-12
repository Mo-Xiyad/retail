import { Clerk } from '@clerk/clerk-sdk-node';
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing CLERK_SECRET_KEY @Trpc utils');
}
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
export async function createOrUpdateClerkUser(
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    companyId: number;
    onboarded: boolean;
    permission: string[];
  },
  password: string
) {
  const clerkPublicMetadata = {
    name: `${userInfo.firstName} ${userInfo.lastName}`,
    email: userInfo.email,
    companyId: userInfo.companyId,
    onboarded: userInfo.onboarded,
    permission: userInfo.permission
  };

  const matchedClerkUser = await clerk.users.getUserList({
    emailAddress: [userInfo.email]
  });

  let clerkUser = matchedClerkUser.at(0);

  // if clerk user already exists then update the public metadata
  if (clerkUser) {
    await clerk.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: clerkPublicMetadata
    });
    await clerk.users.updateUser(clerkUser.id, {
      password,
      skipPasswordChecks: true
    });
    console.log(
      'Clerk user already exists. Updated public metadata and created new password'
    );
    return clerkUser;
  } else {
    try {
      const clerkUser = await clerk.users.createUser({
        externalId: userInfo.email,
        emailAddress: [userInfo.email],
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: 'password',
        publicMetadata: clerkPublicMetadata,
        skipPasswordChecks: true,
        username: `${userInfo.lastName}`
      });
      return clerkUser;
    } catch (error: any) {
      console.log('Error creating clerk user:', error.errors);
      return null;
    }
  }
}
