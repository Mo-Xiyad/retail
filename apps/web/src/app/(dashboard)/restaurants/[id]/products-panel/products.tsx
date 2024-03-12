'use client';

import { Badge } from '@/components/ui/badge';
import { pb } from '@/lib/pb';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { z } from 'zod';
import { DataTable } from '../components/data-table';
import { columns } from './columns';
import { productsSchema } from './schema';

async function getProductsForRestaurant(restaurantId: string) {
  const products = await pb.collection('products').getFullList({
    filter: `restaurant="${restaurantId}"`
  });

  return z.array(productsSchema).parse(products);
}

export default function ProductsTab({ data }: { data?: [] }) {
  const { id } = useParams();
  const products = useQuery(
    ['restaurant', id, 'products', 'list'],
    () => getProductsForRestaurant(id as string),
    {
      enabled: !!id
    }
  );

  if (products.isLoading) {
    return <div>Loading...</div>;
  }
  if (!products.data) {
    return <div>No products found</div>;
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Menu items</h2>
            <p className="text-muted-foreground">
              Here are all the items available in your restaurant.{' '}
              <Badge className="bg-primary  text-white">
                {products.data.length}
              </Badge>
            </p>
          </div>
        </div>
        {products.isLoading || !products.data ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={products.data}
            columns={columns}
            tableName="products"
          />
        )}
      </div>
    </>
  );
}
