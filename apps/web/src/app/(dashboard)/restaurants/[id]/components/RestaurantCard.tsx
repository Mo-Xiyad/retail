export type Restaurant = {
  id: string;
  name: string;
};
interface restaurantProps extends React.HTMLAttributes<HTMLDivElement> {
  restaurant: Restaurant;
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleIcon, StarIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
export function RestaurantCard({ restaurant }: restaurantProps) {
  const router = useRouter();
  return (
    <Card
      className="w-full max-w-xs shadow-sm rounded-md overflow-hidden m-2 cursor-pointer"
      onClick={() => router.push(`/restaurants/${restaurant.id}`)}
    >
      <CardHeader className="grid  items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{restaurant.name}</CardTitle>
          <CardDescription>Address goes here</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            Rating
          </div>
          <div className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3" />
            20k
          </div>
          <div>Member since 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}
