'use client';
import { z } from 'zod';

import { queryClient } from '@/app/(dashboard)/react-query-provider';
import CustomModal from '@/components/custom/CustomModal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleError } from '@/lib/handle-error';
import { pb } from '@/lib/pb';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { CategoriesRecord } from '../../../../../../pocketbase-types';
import { categorySchema } from './schema';

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CategoryTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <CustomModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          trigger={
            <Button>
              Add Category
              <PlusCircledIcon className="ml-2 h-4 w-4" />
            </Button>
          }
          title="Add a new category"
          description="New category will be added if the name is unique."
        >
          <CreateCategoryForm
            buttonText="Create"
            close={() => setIsModalOpen(false)}
          />
        </CustomModal>
      </div>
    </div>
  );
}

const formSchema = z.object({
  categoryName: z.string().min(2, {
    message: 'Category name must be at least 2 characters.'
  })
});

export function CreateCategoryForm(props: {
  close: () => void;
  category?: Omit<z.infer<typeof categorySchema>, 'noProducts'>;
  buttonText: string;
}) {
  const { id } = useParams();
  const defaultValues = {
    categoryName: props.category?.name ?? ''
  } || { categoryName: '' };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const createCategoryMutation = useMutation(
    async (data: z.infer<typeof formSchema>) => {
      if (!pb.authStore.model?.company[0]) throw new Error('Company not found');
      if (props.category) {
        await pb.collection('categories').update(`${props.category?.id}`, {
          name: data.categoryName
        } as CategoriesRecord);
      } else {
        await pb.collection('categories').create({
          company: pb.authStore.model?.company[0],
          name: data.categoryName,
          restaurant: id as string
        } as CategoriesRecord);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories', 'list']);
        props.close();
      },
      onError: handleError
    }
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          createCategoryMutation.mutate(values);
        })}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Category Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{props.buttonText}</Button>
      </form>
    </Form>
  );
}
