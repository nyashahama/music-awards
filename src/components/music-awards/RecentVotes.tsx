import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Nominee } from "../../api/services/nomineeService";
import { UserVoteResponse } from "../../api/services";

interface RecentVotesProps {
  nominees?: Nominee[];
  votes?: UserVoteResponse[];
  isLoading?: boolean;
}

interface NomineeVoteCount {
  nominee: UserVoteResponse["nominee"];
  category: UserVoteResponse["category"];
  voteCount: number;
  lastVote: UserVoteResponse;
}

export default function RecentVotes({
  nominees = [],
  votes = [],
  isLoading = false,
}: RecentVotesProps) {
  // Process votes to get top performers
  const getTopPerformers = (): NomineeVoteCount[] => {
    if (votes.length === 0) {
      return [];
    }

    // Count votes per nominee per category
    const voteMap = new Map<string, NomineeVoteCount>();

    votes.forEach((vote) => {
      const key = `${vote.nominee.nominee_id}-${vote.category.category_id}`;

      if (voteMap.has(key)) {
        const existing = voteMap.get(key)!;
        existing.voteCount += 1;
        // Keep the most recent vote
        if (
          new Date(vote.created_at) > new Date(existing.lastVote.created_at)
        ) {
          existing.lastVote = vote;
        }
      } else {
        voteMap.set(key, {
          nominee: vote.nominee,
          category: vote.category,
          voteCount: 1,
          lastVote: vote,
        });
      }
    });
    console.log(nominees);

    // Convert to array and sort by vote count
    return Array.from(voteMap.values())
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 5); // Top 5 performers
  };

  const topPerformers = getTopPerformers();

  // Calculate percentage change (mock for now - you'd need historical data)
  const getPercentageChange = (index: number): string => {
    const changes = ["+12.5%", "+8.2%", "+5.3%", "+2.1%", "-1.5%"];
    return changes[index] || "+0.0%";
  };

  const getStatus = (index: number): "Leading" | "Rising" | "Falling" => {
    if (index === 0) return "Leading";
    if (index < 3) return "Rising";
    return "Falling";
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 animate-pulse">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/4"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
              <div className="h-6 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topPerformers.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Top Performing Artists
            </h3>
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No votes have been cast yet. Be the first to vote!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Performing Artists
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Artist
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Votes
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {topPerformers.map((performer, index) => (
              <TableRow
                key={`${performer.nominee.nominee_id}-${performer.category.category_id}`}
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                      <img
                        src={
                          performer.nominee.image_url ||
                          "/images/user/owner.jpg"
                        }
                        className="h-[50px] w-[50px] object-cover"
                        alt={performer.nominee.name}
                        onError={(e) => {
                          e.currentTarget.src = "/images/user/owner.jpg";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {performer.nominee.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {getPercentageChange(index)} from last week
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {performer.category.name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {performer.voteCount.toLocaleString()}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      getStatus(index) === "Leading"
                        ? "success"
                        : getStatus(index) === "Rising"
                          ? "warning"
                          : "error"
                    }
                  >
                    {getStatus(index)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
