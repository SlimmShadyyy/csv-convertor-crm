"use client";

import React, { useMemo, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

interface PreviewTableProps {
  data: any[];
  headers: string[];
}

export default function PreviewTable({ data, headers }: PreviewTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<any>();
    return headers.map((header) =>
      columnHelper.accessor(header, {
        header: () => (
          <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">
            {header.replace(/_/g, ' ')}
          </span>
        ),
        cell: (info) => info.getValue() || <span className="text-gray-300">-</span>,
        // Give notes an even wider base size since they wrap a lot of text
        size: header === 'crm_note' || header === 'description' ? 400 : 180,
      })
    );
  }, [headers]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60, 
    overscan: 10,
  });

  return (
    <div
      ref={tableContainerRef}
      className="h-[500px] w-full overflow-auto border border-gray-200 rounded-lg bg-white shadow-sm"
    >
      {/* Replaced <table> with <div> to stop native resizing bugs */}
      <div 
        role="table"
        className="text-sm relative min-w-full"
        style={{ width: table.getTotalSize() }}
      >
        {/* THEAD Equivalent */}
        <div role="rowgroup" className="sticky top-0 bg-white shadow-sm z-10 border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} role="row" className="flex w-full">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  role="columnheader"
                  className="px-6 py-4 flex items-center justify-start text-left"
                  style={{
                    // STRICT FLEX SIZING: Force exact pixel width, no growing or shrinking
                    flex: `0 0 ${header.getSize()}px`,
                    width: `${header.getSize()}px`,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* TBODY Equivalent */}
        <div
          role="rowgroup"
          style={{
            display: 'block',
            height: `${rowVirtualizer.getTotalSize()}px`, 
            position: 'relative',
            width: '100%',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                role="row"
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute flex w-full border-b border-gray-100 hover:bg-gray-50 transition-colors"
                style={{
                  top: 0,
                  left: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const isStatus = cell.column.id === 'crm_status';
                  const value = cell.getValue() as string;

                  return (
                    <div
                      key={cell.id}
                      role="cell"
                      className="px-6 py-4 whitespace-normal break-words flex items-center text-gray-700"
                      style={{ 
                        // STRICT FLEX SIZING: Matches header width exactly
                        flex: `0 0 ${cell.column.getSize()}px`,
                        width: `${cell.column.getSize()}px`,
                      }}
                    >
                      {isStatus && value ? (
                        <span className={`inline-center items-center px-1 py-1 rounded-full text-xs font-medium border
                          ${value === 'GOOD_LEAD_FOLLOW_UP' ? 'bg-green-50 text-green-700 border-green-200' : 
                            value === 'SALE_DONE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            value === 'BAD_LEAD' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-gray-50 text-gray-700 border-gray-200'}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}