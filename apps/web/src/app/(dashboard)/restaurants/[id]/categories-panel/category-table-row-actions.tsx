'use client';

import { queryClient } from '@/app/(dashboard)/react-query-provider';
import CustomModal from '@/components/custom/CustomModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { handleError } from '@/lib/handle-error';
import { pb } from '@/lib/pb';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { DataTableRowActionsProps } from '../products-panel/product-table-row-actions';
import { CreateCategoryForm } from './category-table-toolbar';

export function CategoryTableRowActions<TData>({
  row,
  rowId: categoryId
}: DataTableRowActionsProps<TData>) {
  const [deleteClick, setDeleteClick] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const { id: restaurantId } = useParams();
  const deleteCategoryMutation = useMutation(
    async () => {
      await pb.collection('categories').delete(categoryId as string);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([['categories', 'list']]);
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
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
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
            onClick={() => deleteCategoryMutation.mutate()}
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
        <CreateCategoryForm
          buttonText="Update"
          close={() => setEditClick(false)}
          category={{
            id: categoryId as string,
            name: row.getValue('name')
          }}
        />
      </CustomModal>
    </>
  );
}
