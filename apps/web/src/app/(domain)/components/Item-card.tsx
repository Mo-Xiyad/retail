'use client';
import Image from 'next/image';

export const MenuItemCard = ({ product }: { product: ProductsResponse }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Card
      onClick={() => setOpen(true)}
      className=" flex justify-between bg-[whitesmoke]/30 border-[gray]/10 shadow-md p-0  w-full h-[132px] "
    >
      <DrawerDemo open={open} setOpen={setOpen} product={product} />
      <div className="px-6 py-4 w-full flex flex-col justify-between">
        <div className="w-full">
          <h2 className="font-medium text-md md:text-lg truncate whitespace-normal">
            {product.name}
          </h2>
          <p className="text-gray-700 font-light text-xs truncate whitespace-normal">
            {product.description}
          </p>
        </div>
        <p className="text-md font-semibold  text-green-600 ">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="h-full flex items-center  pr-2">
        {product.image && (
          <Image
            className=" rounded-lg object-cover shrink-0 aspect-square "
            src={pb.files.getUrl(product, product.image)}
            width={144}
            height={144}
            alt={'item.name'}
          />
        )}
      </div>
    </Card>
  );
};

import * as React from 'react';

import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from '@/components/ui/drawer';
import { pb } from '@/lib/pb';
import { ProductsResponse } from '../../../../pocketbase-types';

function DrawerDemo({
  open,
  setOpen,
  product
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: ProductsResponse;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-w-sm mx-auto">
        <div className="mx-auto w-full max-w-sm p-3">
          <DrawerDescription>
            <div className="flex flex-col items-center">
              {product.image && (
                <Image
                  src={pb.files.getUrl(product, product.image)}
                  height={356}
                  width={356}
                  alt={product.name}
                  className="rounded-lg"
                />
              )}
              <div className="w-full p-4 mt-4">
                <DrawerTitle>{product.name}</DrawerTitle>
                <p className="text-gray-700 mt-4">{product.description}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </DrawerDescription>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
