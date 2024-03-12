import PocketBase from 'pocketbase';
import { TypedPocketBase } from '../../pocketbase-types';

export const pb = new PocketBase(
  'https://ghjbtufa.pocketspace.dev'
) as TypedPocketBase;

pb.autoCancellation(false);
