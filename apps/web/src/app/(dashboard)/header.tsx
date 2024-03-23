import { UserButton } from '@clerk/nextjs';
import { MainNav } from './restaurants/[id]/components/main';

export const DashboardHeader = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4  max-w-[1680px]  w-full mx-auto">
        <h2 className=" font-semibold">Feastly</h2>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton
            signInUrl="/sign-in"
            showName
            appearance={{
              variables: {
                colorText: '#5ebaf7'
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
