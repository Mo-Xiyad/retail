"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pb";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Title } from "@radix-ui/react-toast";
import { useParams, useRouter } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import { RestaurantsResponse } from "../../../../../pocketbase-types";
import CategoriesTab from "./categories-panel/categories";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import ProductsTab from "./products-panel/products";

export default function DashboardPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<RestaurantsResponse>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const result = await pb.collection("restaurants").getFirstListItem(`id="${id}" && isDeleted=false`);
        console.log("result", result);
        setRestaurant(result);
      } catch (error) {
        if (error instanceof ClientResponseError) {
          if (error.status === 404) {
            router.push("/404");
          }
          toast({
            title: "An unexpected error occurred",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "An unexpected error occurred",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      }
    })();
  }, []);

  const handleDelete = async () => {
    try {
      await pb.collection("restaurants").update(id as string, {
        isDeleted: true,
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        toast({
          title: "An unexpected error occurred",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "An unexpected error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Restaurant deleted",
      description: "The restaurant has been deleted.",
    });

    router.push("/");
  };

  if (!restaurant) {
    return null;
  }
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{restaurant.name}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DotsHorizontalIcon className="w-6 h-6 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDelete}>Delete Restaurant</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Tabs defaultValue="product" className="space-y-4">
        <TabsList>
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger disabled value="deals">
            Deals
          </TabsTrigger>
        </TabsList>
        {/* <OverviewContent /> */}
        <ProductContent />
        <CategoriesContent restaurantId={id as string} />
        <DealsContent />
      </Tabs>
    </>
  );
}
const DealsContent = () => {
  return (
    <TabsContent value="deals" className="space-y-4">
      <Title className="text-2xl font-bold text-muted-foreground">Deals</Title>
    </TabsContent>
  );
};
const CategoriesContent = ({ restaurantId }: { restaurantId: string }) => {
  return (
    <TabsContent value="categories" className="space-y-4">
      <CategoriesTab data={[]} />
    </TabsContent>
  );
};
const ProductContent = () => {
  return (
    <TabsContent value="product" className="space-y-4">
      <ProductsTab data={[]} />
    </TabsContent>
  );
};
// This is not being used right now (KEEP it for future)
const OverviewContent = () => {
  return (
    <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer reviews</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average peak times</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.56</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Most viewed items</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Referer</CardTitle>
            <CardDescription>Top 5 referers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
