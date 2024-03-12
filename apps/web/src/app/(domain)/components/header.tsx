import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MainNav } from './nav-tabs';

export const UserViewNav = () => {
  return (
    <div className="hidden sm:block shadow-lg mb-2">
      <div className="flex h-16 items-center px-4  w-full mx-auto">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <SelectLanguage />
        </div>
      </div>
    </div>
  );
};

export function SelectLanguage() {
  return (
    <Select defaultValue={'swedish'}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="swedish">Sv</SelectItem>
          <SelectItem value="english">En</SelectItem>
          <SelectItem value="spanish">Es</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
