import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../components/data-table-column-header';
import { CategoryTableRowActions } from './category-table-row-actions';
import { Category } from './schema';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
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
    id: 'noProducts',
    accessorKey: 'noProducts',
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. of Products" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">
          <Badge variant="secondary" className="">
            {row.getValue('noProducts')}
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
      return <CategoryTableRowActions row={row} rowId={rowId} />;
    }
  }
];
