'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { pb } from '@/lib/pb';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { TabsContent } from '@radix-ui/react-tabs';
import { useState } from 'react';
import { RestaurantCard } from './restaurants/[id]/components/RestaurantCard';

export const getRestaurants = async () => {
  console;
  const result = await pb.collection('restaurants').getFullList({
    filter: `isDeleted = false && company = "${pb.authStore.model?.company}"`
  });
  return result;
};

export const RestaurantsList = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const restaurants = useQuery(['restaurant', 'list'], () => getRestaurants());

  return (
    <div>
      <Tabs defaultValue="music" className="h-full space-y-6">
        <TabsContent value="music" className="border-none p-0 outline-none">
          <div className="mt-6 space-y-1 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Restaurants
              </h2>
              <p className="text-sm text-muted-foreground">
                Listed below are the restaurants that are registered with
                feastly.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CustomModal
                onOpenChange={setModalOpen}
                open={modalOpen}
                trigger={<Button>Create Restaurant</Button>}
                title="Create a new restaurant"
                description="New restaurant will be added to the list below."
              >
                <CreateRestaurantForm close={() => setModalOpen(false)} />
              </CustomModal>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <div className="flex flex-wrap pb-4">
              {restaurants.data &&
                restaurants.data.map((album) => (
                  <RestaurantCard key={album.name} restaurant={album} />
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { z } from 'zod';

import CustomModal from '@/components/custom/CustomModal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { toast } from '@/components/ui/use-toast';
// import { useUser } from '@/lib/useUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { trpc } from '../_trpc/client';
import { queryClient } from './react-query-provider';

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: 'name must be at least 2 characters.'
  }),
  orgId: z.string().min(2, {
    message: 'orgId must be at least 2 characters.'
  })
});

export function CreateRestaurantForm(props: { close: () => void }) {
  const router = useRouter();
  // const user = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  const { mutate } = trpc.company.createCompany.useMutation();
  function handleSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess() {
        toast({
          title: 'Restaurant Created',
          description: 'Restaurant has been created successfully',
          status: 'success'
        });
        queryClient.invalidateQueries('company');
        props.close();
      },
      onError(error) {
        console.log('error', error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => handleSubmit(values))}
        className="space-y-6"
      >
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className=" space-y-1">
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orgId"
            render={({ field }) => (
              <FormItem className=" space-y-1">
                <FormLabel>Organization Id</FormLabel>
                <FormControl>
                  <Input placeholder="Organization Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">
          {form.formState.isSubmitting && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Company
        </Button>
      </form>
    </Form>
  );
}
