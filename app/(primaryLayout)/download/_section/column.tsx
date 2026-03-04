'use client';

/* eslint-disable radix */
import { ColumnDef } from '@tanstack/react-table';
// eslint-disable-next-line import/prefer-default-export
export const headers: ColumnDef<object>[] = [
    {
        id: 'id',
        header: 'ID',
        cell: ({ row }) => parseInt(row.id) + 1,
    },
    {
        accessorKey: 'nama_file',
        header: 'NAMA',
        cell: ({ row }: any) => (
            <a className="text-blue-800" target="_blank" href={row.original.url_file} rel="noreferrer">
                {row.original.nama_file}
            </a>
        ),
    },
    {
        accessorKey: 'user',
        header: 'Di Buat Oleh',
        cell: ({ row }: any) => <span>{row.original.user.name}</span>,
    },
];
