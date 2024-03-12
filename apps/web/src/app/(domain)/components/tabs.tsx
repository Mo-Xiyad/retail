import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ProductsResponse } from '../../../../pocketbase-types';
export function CategoryTabs({
  productsGroupedByCategory
}: {
  productsGroupedByCategory: Record<
    string,
    {
      name: string;
      products: ProductsResponse[];
    }
  >;
}) {
  return (
    <Tabs
      defaultValue="all"
      className="sticky top-0 py-2 px-2 bg-white backdrop:blur-xl z-20"
    >
      <ScrollArea className=" whitespace-nowrap ">
        <TabsList className="w-full flex space-x-5 bg-transparent my-2 ">
          {Object.entries(productsGroupedByCategory).map(([id, category]) => (
            <Link key={id} href={`#${id}`}>
              <TabsTrigger
                key={id}
                value={category.name}
                className={
                  'bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 shadow border border-gray-300'
                }
              >
                {category.name}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
