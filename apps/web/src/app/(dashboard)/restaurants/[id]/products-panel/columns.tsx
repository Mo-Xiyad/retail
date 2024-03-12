import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../components/data-table-column-header';
import { ProductTableRowActions } from './product-table-row-actions';
import { Product } from './schema';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('price') + ' ' + 'SEK'}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-light">
            {row.getValue('category')}
          </span>
        </div>
      );
    }
  },

  {
    id: 'is_deal',
    accessorKey: 'is_deal',
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="On Deal" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">
          <Badge variant="secondary" className="">
            {row.getValue('is_deal') ? 'Yes' : 'No'}
          </Badge>
        </div>
      );
    }
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      const rowId = row.getValue('id') as string;
      return <ProductTableRowActions row={row} rowId={rowId} />;
    }
  }
];
