/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/rules-of-hooks */

'use client';

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { downloadInterface } from '@/types/dataDownloadInterface';
import { headers } from './column';

type Props = {
    data: downloadInterface[];
};

export default function reactTable({ data }: Props) {
    const columns = useMemo(() => headers, []);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {
                // eslint-disable-next-line react/jsx-props-no-spreading
                isClient && (
                    <div className="container mx-auto">
                        <h1 className="lg:text-2xl sm:text-base font-semibold m-4 my-3">Download Document</h1>
                        <select
                            className="w-32 mx-4 px-2 mb-3 border text-sm border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                        >
                            {[10, 50, 100, 250, 500].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                        <div className="mx-4">
                            <table className="min-w-full">
                                <thead>
                                    {table.getHeaderGroups().map((headerGroup: any) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header: any) => (
                                                <th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className="px-5 py-3 border-b-2 border-gray-100 bg-zinc-100 text-left text-xs font-semibold text-dark uppercase tracking-wider"
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <div
                                                            {...{
                                                                className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                                                                onClick: header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {{
                                                                asc: ' 🔼',
                                                                desc: ' 🔽',
                                                            }[header.column.getIsSorted() as string] ?? null}
                                                        </div>
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={table.getHeaderGroups()[0].headers.length}
                                                className="px-5 py-4 text-sm text-center text-black"
                                            >
                                                Tidak Ada Data
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {table.getRowModel().rows.map((row: any) => (
                                                <tr key={row.id}>
                                                    {row.getVisibleCells().map((cell: any) => (
                                                        <td
                                                            key={cell.id}
                                                            className={`px-5 py-4 border-b border-gray-200 text-sm ${
                                                                row.id % 2 === 0 ? 'bg-zinc-50' : 'bg-white'
                                                            } text-dark`}
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                            <div className="w-full flex justify-center mt-3">
                                <span className="flex items-center gap-1">
                                    <span className="text-gray-600">Go to page:</span>
                                    <input
                                        type="number"
                                        defaultValue={table.getState().pagination.pageIndex + 1}
                                        onChange={(e) => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                            table.setPageIndex(page);
                                        }}
                                        className="border border-gray-300 rounded px-2 w-16 hover:border-gray-300 focus:border-gray-300 focus:ring-0"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
