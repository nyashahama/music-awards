import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNominees } from "../../hooks";
import { NomineeResponse } from "../../api/services/nomineeService";

interface CategoryVotingTableProps {
  categoryId: string;
  categoryName: string;
}

export default function CategoryVotingTable({
  categoryId,
  categoryName,
}: CategoryVotingTableProps) {
  const { getNomineesByCategory } = useNominees();
  const [nominees, setNominees] = useState<NomineeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const categoryNominees = await getNomineesByCategory(categoryId);

        // Fetch full details for each nominee
        const nomineesWithDetails = await Promise.all(
          categoryNominees.map(async (brief) => {
            // If you have a method to get full nominee details, use it
            // Otherwise, we'll work with the brief data
            return brief as unknown as NomineeResponse;
          })
        );

        setNominees(nomineesWithDetails);
      } catch (err) {
        console.error("Failed to fetch nominees:", err);
        setError("Failed to load nominees. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchNominees();
    }
  }, [categoryId, getNomineesByCategory]);

  const getRandomStatus = () => {
    const statuses = ["Leading", "Rising", "Stable"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomVotes = () => {
    return `${(Math.random() * 15 + 5).toFixed(1)}K`;
  };

  const getRandomTrend = (): "up" | "down" | "stable" => {
    const trends: ("up" | "down" | "stable")[] = ["up", "down", "stable"];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {categoryName} 2024
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vote for your favorite in {categoryName.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Loading nominees...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {categoryName} 2024
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vote for your favorite in {categoryName.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (nominees.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {categoryName} 2024
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vote for your favorite in {categoryName.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No nominees found for this category yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Table Header with Category Info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {categoryName} 2024
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vote for your favorite in {categoryName.toLowerCase()}
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Vote Now
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Artist
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Description
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Votes
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {nominees.map((nominee) => {
              const trend = getRandomTrend();
              const status = getRandomStatus();
              const votes = getRandomVotes();

              return (
                <TableRow
                  key={nominee.nominee_id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-full">
                        <img
                          width={48}
                          height={48}
                          src={
                            nominee.image_url || "/images/artists/default.jpg"
                          }
                          alt={nominee.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = "/images/artists/default.jpg";
                          }}
                        />
                        {trend === "up" && (
                          <div className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                          </div>
                        )}
                        {trend === "down" && (
                          <div className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                          {nominee.name}
                        </span>
                        {nominee.categories &&
                          nominee.categories.length > 0 && (
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {nominee.categories
                                .map((cat) => cat.name)
                                .join(", ")}
                            </span>
                          )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-xs">
                    <p className="truncate">{nominee.description}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        status === "Leading"
                          ? "success"
                          : status === "Rising"
                            ? "warning"
                            : "default"
                      }
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-theme-sm dark:text-white">
                        {votes}
                      </span>
                      {trend === "up" && (
                        <span className="text-xs text-green-500">↑ 12%</span>
                      )}
                      {trend === "down" && (
                        <span className="text-xs text-red-500">↓ 5%</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <button className="px-4 py-2 text-xs font-medium text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600">
                      Vote
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Showing {nominees.length} of {nominees.length} nominees
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 text-gray-700 transition-colors border border-gray-200 rounded-lg dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1 text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
