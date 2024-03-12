'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { pb } from '@/lib/pb';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { TabsContent } from '@radix-ui/react-tabs';
import { useState } from 'react';
import { RestaurantsRecord } from '../../../pocketbase-types';
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
  // const user = useUser();

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
import { handleError } from '@/lib/handle-error';
// import { useUser } from '@/lib/useUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { queryClient } from './react-query-provider';

const formSchema = z.object({
  restaurantName: z.string().min(2, {
    message: 'name must be at least 2 characters.'
  }),
  address: z.string().min(2, {
    message: 'address must be at least 2 characters.'
  }),
  city: z.string().min(2, {
    message: 'city must be at least 2 characters.'
  }),
  postalCode: z.string().min(2, {
    message: 'postal code must be at least 2 characters.'
  }),
  phoneNumber: z.string().min(7, {
    message: 'phone number must be at least 7 characters.'
  })
});

export function CreateRestaurantForm(props: { close: () => void }) {
  const router = useRouter();
  // const user = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const CreateRestaurantMutation = useMutation(
    (values: z.infer<typeof formSchema>) => {
      return pb.collection('restaurants').create({
        name: values.restaurantName,
        address: values.address,
        city: values.city,
        company: 'knno483bn5fyf6c',
        subdomain: values.restaurantName.toLowerCase().replaceAll(' ', '-'),
        zip_code: values.postalCode,
        phone_number: values.phoneNumber
      } as RestaurantsRecord);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['restaurant', 'list']);
        toast({
          title: 'Restaurant created',
          description: 'Your restaurant has been created.'
        });
        props.close();
      },
      onError: handleError
    }
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          CreateRestaurantMutation.mutate(values)
        )}
        className="space-y-6"
      >
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="restaurantName"
            render={({ field }) => (
              <FormItem className=" space-y-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Restaurant Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className=" space-y-1 w-full">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className=" space-y-1 ">
                  <FormLabel>City </FormLabel>
                  <FormControl>
                    <Input placeholder="city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className=" space-y-1">
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className=" space-y-">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
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
          Create Restaurant
        </Button>
      </form>
    </Form>
  );
}
