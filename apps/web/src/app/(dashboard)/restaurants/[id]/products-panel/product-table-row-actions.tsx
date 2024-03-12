'use client';

import { queryClient } from '@/app/(dashboard)/react-query-provider';
import CustomModal from '@/components/custom/CustomModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { handleError } from '@/lib/handle-error';
import { pb } from '@/lib/pb';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { z } from 'zod';
import { CreateProductForm } from './products-table-toolbar';
import { productsSchema } from './schema';

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  rowId?: string;
}

async function getCurrentProduct(productId: string) {
  const product = (await pb
    .collection('products')
    .getFirstListItem(`id="${productId}"`)) as z.infer<typeof productsSchema>;

  return productsSchema.parse(product);
}
export function ProductTableRowActions<TData>({
  row,
  rowId: productId
}: DataTableRowActionsProps<TData>) {
  const [deleteClick, setDeleteClick] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const { id: restaurantId } = useParams();
  const product = useQuery(
    ['restaurant', restaurantId, 'products', 'get', productId],
    async () => getCurrentProduct(productId as string),
    {
      enabled: editClick
    }
  );

  const deleteProductMutation = useMutation(
    async () => {
      await pb.collection('products').delete(productId as string);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'restaurant',
          restaurantId,
          'products',
          'list'
        ]);
        setDeleteClick(false);
      },
      onError: handleError
    }
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onSelect={async () => {
              setEditClick(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDeleteClick(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomModal
        trigger={<></>}
        open={deleteClick}
        onOpenChange={() => setDeleteClick(false)}
        title="Delete product"
        description="Are you sure you want to delete this product?"
      >
        <div className="flex justify-between space-x-2">
          <Button
            variant="destructive"
            onClick={() => deleteProductMutation.mutate()}
          >
            {' '}
            Delete
          </Button>
        </div>
      </CustomModal>

      <CustomModal
        trigger={<></>}
        open={editClick}
        onOpenChange={() => setEditClick(false)}
        title="Edit product"
        description="Edit the product details."
      >
        {product.data && (
          <CreateProductForm
            buttonText="Update"
            close={() => setEditClick(false)}
            product={{
              id: productId as string,
              name: row.getValue('name'),
              price: row.getValue('price'),
              category: row.getValue('category'),
              is_deal: row.getValue('is_deal')
            }}
          />
        )}
      </CustomModal>
    </>
  );
}
