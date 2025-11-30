import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type { SubmissionsResponse, Submission } from "../types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "../api/clients";

const columnHelper = createColumnHelper<Submission>();

export default function SubmissionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions", page, limit],
    queryFn: () => apiClient.getSubmissions(page, limit),
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue().slice(0, 8) + "...",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "view",
      header: "View",
      cell: () => (
        <button className="text-blue-600 hover:text-blue-900 font-medium text-sm flex items-center gap-1">
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-medium">{data!.totalItems}</span>{" "}
            submissions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          data={data!}
          currentPage={page}
          limit={limit}
          onPageChange={(newPage) =>
            setSearchParams({
              page: newPage.toString(),
              limit: limit.toString(),
            })
          }
          onLimitChange={(newLimit) =>
            setSearchParams({ page: "1", limit: newLimit.toString() })
          }
        />
      </div>
    </div>
  );
}

interface PaginationProps {
  data: SubmissionsResponse;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function PaginationControls({
  data,
  currentPage,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{data.totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={currentPage === data.totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center min-h-[400px] space-x-2 text-red-600">
      <AlertCircle className="w-8 h-8" />
      <span>Failed to load submissions. Please refresh.</span>
    </div>
  );
}
