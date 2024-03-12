'use client';
import { z } from 'zod';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';

import { queryClient } from '@/app/(dashboard)/react-query-provider';
import CustomModal from '@/components/custom/CustomModal';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { handleError } from '@/lib/handle-error';
import { pb } from '@/lib/pb';
// import { useUser } from '@/lib/useUser';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { ProductsRecord } from '../../../../../../pocketbase-types';
import { DataTableToolbarProps } from '../categories-panel/category-table-toolbar';
import { productsSchema } from './schema';

export function ProductsTableToolbar<TData>({
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
              Create Product
              <PlusCircledIcon className="ml-2 h-4 w-4" />
            </Button>
          }
          title="New product"
          description="Add a new item to the list of products."
        >
          <CreateProductForm
            buttonText="Create"
            close={() => setIsModalOpen(false)}
          />
        </CustomModal>
      </div>
    </div>
  );
}

const formSchema = z.object({
  productName: z.string().min(2, {
    message: 'product name must be at least 2 characters.'
  }),
  price: z.coerce.number().min(0, {
    message: 'price must be at least 0.'
  }),
  category: z.string().min(2, {
    message: 'category must be at least 2 characters.'
  }),
  isDeal: z.boolean().optional().default(false)
});

export function CreateProductForm(props: {
  close: () => void;
  product?: z.infer<typeof productsSchema>;
  buttonText: string;
}) {
  const { id } = useParams();
  // const user = useUser();

  const defaultValues = ({
    productName: props.product?.name,
    price: props.product?.price,
    category: props.product?.category.at(0) || '',
    isDeal: props.product?.is_deal
  } as z.infer<typeof formSchema>) || {
    productName: '',
    price: 0,
    category: '',
    isDeal: false
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const categories = useQuery(
    ['restaurant', id, 'categories', 'list'],
    async () => {
      const categories = await pb.collection('categories').getFullList({
        filter: `restaurant="${id}"`
      });

      return categories;
    }
  );

  const createOrUpdateProduct = async (values: z.infer<typeof formSchema>) => {
    if (props.product) {
      console.log(props.product.id);

      await pb.collection('products').update(`${props.product?.id}`, {
        name: values.productName,
        category: [values.category],
        is_deal: values.isDeal
      });
    } else {
      await pb.collection('products').create({
        name: values.productName,
        restaurant: id as string,
        company: 'knno483bn5fyf6c',
        price: values.price,
        category: [values.category],
        is_deal: values.isDeal
      } as ProductsRecord);
    }
  };
  const createProductMutation = useMutation(createOrUpdateProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'restaurant',
        id,
        'products',
        'list'
      ]);
      form.reset();
      props.close();
    },
    onError: handleError
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          createProductMutation.mutate(values);
        })}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Select
          value={form.watch('category')}
          onValueChange={(val) => form.setValue('category', val)}
        >
          <Label>Category</Label>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.data?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Price" type="number" {...field} />
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
