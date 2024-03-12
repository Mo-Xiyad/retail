'use client';

import { Badge } from '@/components/ui/badge';
import { pb } from '@/lib/pb';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { z } from 'zod';
import { DataTable } from '../components/data-table';
import { columns } from './columns';
import { categorySchema } from './schema';

async function getCategories({ restaurantId }: { restaurantId: string }) {
  const noMap: { [key: string]: number } = {};

  const [products, categories] = await Promise.all([
    pb.collection('products').getFullList({
      filter: `restaurant="${restaurantId}"`
    }),
    pb.collection('categories').getFullList({
      filter: `restaurant="${restaurantId}"`
    })
  ]);

  console.log(products, categories);
  for (const product of products) {
    for (const category of product.category) {
      const entry = noMap[category];
      noMap[category] = entry ? entry + 1 : 1;
    }
  }

  return categories.map((category) => {
    return {
      ...category,
      name: category.name,
      noProducts: noMap[category.id] || 0
    };
  }) as z.infer<typeof categorySchema>[];
}

export default function CategoriesTab({ data }: { data?: [] }) {
  const { id } = useParams();
  const categories = useQuery(['categories', 'list'], () =>
    getCategories({ restaurantId: id as string })
  );

  if (categories.isLoading) {
    return <div>Loading...</div>;
  }

  if (!categories.data) {
    return <div>No categories found</div>;
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here are all the catagories you have created.{' '}
              <Badge className="bg-primary  text-white">
                {categories.data.length}
              </Badge>
            </p>
          </div>
        </div>
        <DataTable
          data={categories.data}
          columns={columns}
          tableName="categories"
        />
      </div>
    </>
  );
}
