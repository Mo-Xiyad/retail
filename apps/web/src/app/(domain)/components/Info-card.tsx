'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from '@/components/ui/drawer';
import { DotFilledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import { RestaurantsRecord } from '../../../../pocketbase-types';

export function InfoCard({ restaurant }: { restaurant: RestaurantsRecord }) {
  const isRestaurantOpen = true;
  const [open, setOpen] = useState(false);
  return (
    <Card className="z-10 w-10/12  max-w-xl mx-auto border-none bg-white shadow-md text-black  overflow-hidden ">
      <CardContent className="flex items-center py-5">
        <div className="md:p-4 p-2 rounded-md">
          <Image
            src={restaurant.logo!}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>
        {/* <div className="items-center text-center w-full"> */}
        <div className="flex flex-col ml-4 md:ml-5 w-full">
          <div className="">
            <h1 className="text-lg md:text-xl font-semibold ">
              {restaurant.name}
            </h1>
            <p className="md:text-base text-sm">{restaurant.address}</p>
            <p className="md:text-base text-sm">{restaurant.phone_number}</p>
            {/* <div className="flex items-center justify-center space-x-2"> */}
            <div className="flex flex-row items-center justify-start text-left">
              <DotFilledIcon
                className={`w-8 h-8 text-green-500 justify-start -ml-2`}
                aria-label="Open"
              />
              <span className=" md:text-base text-sm">
                {isRestaurantOpen ? 'Open' : 'Closed'}
              </span>

              <InfoCircledIcon
                onClick={() => setOpen(true)}
                className={`w-4 h-4 md:w-6 md:h-6 text-black justify-start ml-2 hover:text-primary hover:cursor-pointer hover:scale-110 transition-transform duration-200`}
                aria-label="Open"
              />
            </div>
          </div>
        </div>
        <DrawerDemo open={open} setOpen={setOpen} restaurant={restaurant} />
      </CardContent>
    </Card>
  );
}

export function DrawerDemo({
  open,
  setOpen,
  restaurant
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  restaurant: RestaurantsRecord;
}) {
  const [goal, setGoal] = useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-w-sm mx-auto">
        <div className="mx-auto w-full max-w-sm p-3">
          <DrawerDescription>
            <div className="flex flex-col items-center">
              <div className="w-full p-4 mt-4 flex flex-col items-center ">
                <DrawerTitle>Bumble</DrawerTitle>
                <p className="text-gray-700 mt-4">{restaurant?.description}</p>
                <p className="mt-2">
                  <span className="text-gray-700">Location:</span>{' '}
                  {restaurant.address}
                </p>
                <p>
                  <span className="text-gray-700">Phone:</span>{' '}
                  {restaurant.phone_number}
                </p>
                <div className="flex flex-col items-center mt-4">
                  <h3 className="text-gray-700 text-md font-medium">
                    Opening Hours
                  </h3>
                  <div className="flex flex-col items-center mt-2">
                    <p>Monday - Friday</p>
                    <p>11:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </DrawerDescription>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
