import { Metadata } from 'next';
import { RestaurantsList } from '../restaurants-list';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.'
};

export default function HomePage() {
  return (
    <h2>
      <RestaurantsList />
    </h2>
  );
}
