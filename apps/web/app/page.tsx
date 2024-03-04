'use client';

import { Button } from '@repo/ui/src/index';

function Gradient({
  conic,
  className,
  small
}: {
  small?: boolean;
  conic?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={`absolute mix-blend-normal will-change-[filter] rounded-[100%] ${
        small ? 'blur-[32px]' : 'blur-[75px]'
      } ${conic ? 'bg-glow-conic' : ''} ${className}`}
    />
  );
}
export default function Web() {
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
