'use client';

import { Button } from '@repo/ui/src/index';
import { trpc } from './_trpc/client';

export default function Web() {
  const { data, isLoading } = trpc.test.getUser.useQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data);
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-[#a79494] to-[#fcfbfb]">
      <h1>Web</h1>
      <Button onClick={() => console.log('Pressed!')} text="Boop" />
      <div className="relative flex place-items-center ">
        <p className="text-4xl font-bold text-center">Hello, world!</p>
      </div>
    </div>
  );
}
