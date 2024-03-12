import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { pb } from '@/lib/pb';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ProductsResponse,
  RestaurantsRecord
} from '../../../../pocketbase-types';
import bg from '../../../../public/benner.jpeg';
import item1 from '../../../../public/events/event-1.jpeg';
import item2 from '../../../../public/events/event-2.jpeg';
import item3 from '../../../../public/events/event-3.webp';
import item4 from '../../../../public/events/event-4.jpeg';
import item5 from '../../../../public/events/event-5.jpeg';
import item6 from '../../../../public/events/event-6.webp';
import item7 from '../../../../public/events/event-7.jpeg';
import item8 from '../../../../public/events/event-8.jpeg';
import { InfoCard } from '../components/Info-card';
import { MenuItemCard } from '../components/Item-card';
import { CategoryTabs } from '../components/tabs';
const images = [item1, item2, item3, item4, item5, item6, item7, item8];

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.'
};

export default async function HomePage({ params }: { params: { id: string } }) {
  const restaurantWithProducts = await pb
    .collection('restaurants')
    .getList(1, 1, {
      filter: `subdomain="${params.id}"`,
      expand: 'products(restaurant),categories(restaurant)'
    })
    .then((res) => res.items.at(0));

  if (!restaurantWithProducts) {
    return notFound();
  }

  const restaurant = {
    address: restaurantWithProducts.address,
    banner: pb.files.getUrl(
      restaurantWithProducts,
      restaurantWithProducts.banner
    ),
    logo: pb.files.getUrl(restaurantWithProducts, restaurantWithProducts.logo),
    city: restaurantWithProducts.city,
    company: restaurantWithProducts.company,
    name: restaurantWithProducts.name,
    zip_code: restaurantWithProducts.zip_code,
    phone_number: restaurantWithProducts.phone_number
  } as RestaurantsRecord;

  const products = (restaurantWithProducts?.expand as any)[
    'products(restaurant)'
  ] as ProductsResponse[];
  const categories = (restaurantWithProducts?.expand as any)[
    'categories(restaurant)'
  ] as ProductsResponse[];

  const categoriesMap = categories.reduce(
    (acc, category) => {
      acc[category.id] = {
        name: category.name,
        products: []
      };
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        products: ProductsResponse[];
      }
    >
  );

  for (const product of products) {
    for (const category of product.category) {
      categoriesMap[category].products.push(product);
    }
  }

  for (const category in categoriesMap) {
    if (categoriesMap[category].products.length === 0) {
      delete categoriesMap[category];
    }
  }

  return (
    <div className=" min-h-screen ">
      <div className="relative md:h-56 h-48  bg-gradient-to-r from-slate-100 to-slate-300 shadow-md">
        <Image
          src={bg}
          alt="hero"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className=" absolute -bottom-[70px] md:top-36 left-0 right-0  z-10">
          <InfoCard restaurant={restaurant} />
        </div>
      </div>
      {/* <div className="lg:w-7/12  md:w-11/12 w-full p-1"> */}
      <div className="flex flex-wrap justify-center max-w-6xl mx-auto mt-20 mb-4">
        <h2 className="w-full text-left pl-4 lg:pl-0 pt-4  text-xl font-semibold">
          Our gallery
        </h2>
        <ScrollArea className=" whitespace-nowrap my-2 ">
          <div className="w-full flex space-x-5 bg-transparent my-2 ">
            {images.map((image, index) => (
              <Image
                key={index}
                className={cn(
                  'w-full hover:rounded-lg rounded-lg object-cover  aspect-square h-40',
                  index === 0 && 'ml-3'
                )}
                src={image}
                alt={'imgae'}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="">
        <CategoryTabs productsGroupedByCategory={categoriesMap} />
        <div className="mt-4">
          {Object.entries(categoriesMap).map(([id, category]) => (
            <div
              key={id}
              className=" grow-0 mb-8  max-w-6xl w-full mx-auto scroll-mt-12"
              id={id}
            >
              <h2 className="w-full text-left pl-4 pt-4 pb-2 text-xl font-semibold">
                {category.name}
              </h2>
              <div className="w-full px-2 mt-3 auto-cols-max grid grid-cols-1 md:grid-cols-2  gap-4">
                {category.products.map((product, index) => (
                  <MenuItemCard key={id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
