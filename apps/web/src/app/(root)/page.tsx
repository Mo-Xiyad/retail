'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { trpc } from '../_trpc/client';

export default function Web() {
  const { data, isLoading } = trpc.test.getUser.useQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data);
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-cyan-100">
      <h1>Web</h1>
      {/* <Button onClick={() => console.log('Pressed!')} text="Boop" /> */}
      <Badge variant="default">Badge</Badge>
      <Label htmlFor="email">Your email address</Label>

      <div className="relative flex place-items-center ">
        <p className="text-4xl font-bold text-center">Hello, world!</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
