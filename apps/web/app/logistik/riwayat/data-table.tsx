"use client"

import { useState, useRef, useEffect } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  
  // State for opening our custom columns dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Input
          placeholder="Cari nama vendor..."
          value={(table.getColumn("vendor")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("vendor")?.setFilterValue(event.target.value)
          }
          className="h-10 max-w-sm rounded-xl border-slate-300 bg-white text-xs font-semibold text-slate-900 shadow-2xs focus:border-emerald-600"
        />

        {/* Coded custom dropdown checklist for Column Visibility */}
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="outline" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 px-4 rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs"
          >
            Filter Kolom
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-3 animate-in fade-in zoom-in-95">
              <h4 className="px-3 mb-2 text-xs font-black uppercase tracking-widest text-slate-500">Tampilkan Kolom</h4>
              <div className="space-y-1">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide() && column.id !== "id" && column.id !== "waktu")
                  .map((column) => {
                    let nameDisplay = column.id;
                    if (column.id === "vendor") nameDisplay = "Mitra Vendor"
                    if (column.id === "sekolah") nameDisplay = "Sekolah Tujuan"
                    if (column.id === "porsi") nameDisplay = "Total Porsi"
                    if (column.id === "status") nameDisplay = "Status Pengiriman"

                    return (
                      <label key={column.id} className="flex items-center gap-3 px-3 py-2 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors group">
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="size-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors capitalize">{nameDisplay}</span>
                      </label>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <Table>
          <TableHeader className="bg-slate-100/90 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-3 px-6 text-xs font-black text-slate-900">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-emerald-50/30 border-b border-slate-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 px-6 text-xs font-medium text-slate-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-xs font-bold text-slate-400">
                  Tidak ada data riwayat distribusi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-9 px-5 rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs"
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-9 px-5 rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold text-xs shadow-xs"
        >
          Berikutnya
        </Button>
      </div>
    </div>
  )
}
