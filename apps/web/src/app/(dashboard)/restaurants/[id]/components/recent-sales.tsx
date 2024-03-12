import { Avatar } from '@/components/ui/avatar';
// import fb from '../../../../../../public/socials/facebook.png';
// import instagram from '../../../../../../public/socials/instagram.png';
// import tiktok from '../../../../../../public/socials/tiktok.png';
// import twitter from '../../../../../../public/socials/twitterx.png';
export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          {/* <Image src={fb} alt="facebook" /> */}
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            olivia.martin@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center ">
          {/* <Image src={instagram} alt="instagram" /> */}
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Lee</p>
          <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
        </div>
        <div className="ml-auto font-medium">39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          {/* <Image src={tiktok} alt="tiktok" /> */}
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
          <p className="text-sm text-muted-foreground">
            isabella.nguyen@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          {/* <Image src={twitter} alt="twitter" /> */}
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-sm text-muted-foreground">will@email.com</p>
        </div>
        <div className="ml-auto font-medium">99.00</div>
      </div>
    </div>
  );
}
