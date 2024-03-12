import { cn } from '@/lib/utils';
import Image from 'next/image';
import logo from '../../../../public/feastly-logo.png';
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Image src={logo} alt="Feastly" width={40} height={40} />
    </nav>
  );
}
