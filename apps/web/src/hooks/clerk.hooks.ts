'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

type Session =
  | {
      status: 'authorized';
      user: {
        id: string;
        name: string;
        picture: string;
      };
    }
  | {
      status: 'loading' | 'unauthorized';
      user: null;
    };

export function useSession() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [session, setSession] = useState<Session>({
    status: 'loading',
    user: null
  });

  useEffect(() => {
    if (!isLoaded) {
      setSession({ status: 'loading', user: null });
      return;
    }

    if (!isSignedIn) {
      setSession({ status: 'unauthorized', user: null });
      return;
    }

    if (Object.keys(clerkUser.publicMetadata).length === 0) {
      setSession({ status: 'unauthorized', user: null });
      return;
    }

    setSession({
      status: 'authorized',
      user: {
        ...clerkUser.publicMetadata,
        id: clerkUser.id,
        picture: clerkUser.imageUrl,
        name: clerkUser.firstName + ' ' + clerkUser.lastName
      }
    });
  }, [isLoaded, isSignedIn, clerkUser]);
  return session;
}
