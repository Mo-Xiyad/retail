import { MainNav } from "./restaurants/[id]/components/main";
import { Search } from "./restaurants/[id]/components/search";
import { UserNav } from "./restaurants/[id]/components/user-nav";

export const DashboardHeader = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4  max-w-[1680px]  w-full mx-auto">
        <h2 className=" font-semibold">Feastly</h2>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
};
