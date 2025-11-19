// Updated CategoryVotingTable.tsx
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Nominee {
  id: number;
  artist: {
    image: string;
    name: string;
    stageName: string;
  };
  song: string;
  supporters: {
    images: string[];
    count: number;
  };
  status: string;
  votes: string;
  trend: string;
}

interface CategoryVotingTableProps {
  category: string;
}

// Mock data generator based on category
const generateCategoryData = (category: string): Nominee[] => {
  const baseData: Record<string, Partial<Nominee>[]> = {
    "Best Male Artist": [
      {
        artist: {
          image: "/images/artists/artist-01.jpg",
          name: "Desmond Chideme",
          stageName: "Stunner",
        },
        song: "Dzimba Remabwe",
        status: "Leading",
      },
      {
        artist: {
          image: "/images/artists/artist-02.jpg",
          name: "Rodney Tafadzwa Munyika",
          stageName: "Seh Calaz",
        },
        song: "Mabhanditi",
        status: "Rising",
      },
    ],
    "Best Female Artist": [
      {
        artist: {
          image: "/images/artists/female-01.jpg",
          name: "Tammy Moyo",
          stageName: "Tammy",
        },
        song: "Sweet Love",
        status: "Leading",
      },
      {
        artist: {
          image: "/images/artists/female-02.jpg",
          name: "Janet Manyore",
          stageName: "Jah Signal",
        },
        song: "Mafira",
        status: "Rising",
      },
    ],
    "Song of the Year": [
      {
        artist: {
          image: "/images/artists/artist-05.jpg",
          name: "Garikai Machembere",
          stageName: "Winky D",
        },
        song: "Disappear",
        status: "Leading",
      },
    ],
    "Best Collaboration": [
      {
        artist: {
          image: "/images/artists/collab-01.jpg",
          name: "Stunner ft. Enzo Ishall",
          stageName: "Stunner & Enzo",
        },
        song: "Joint Effort",
        status: "Leading",
      },
    ],
    "Best Newcomer": [
      {
        artist: {
          image: "/images/artists/newcomer-01.jpg",
          name: "Talent Mapeza",
          stageName: "Young Talent",
        },
        song: "First Step",
        status: "Rising",
      },
    ],
  };

  const categoryNominees = baseData[category] || baseData["Best Male Artist"];

  return categoryNominees.map((nominee, index) => ({
    id: index + 1,
    artist: {
      image: nominee.artist?.image || "/images/artists/default.jpg",
      name: nominee.artist?.name || "Unknown Artist",
      stageName: nominee.artist?.stageName || "Unknown",
    },
    song: nominee.song || "Unknown Song",
    supporters: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ].slice(0, (index % 3) + 1),
      count: Math.floor(Math.random() * 1000) + 500,
    },
    status: nominee.status || "Stable",
    votes: `${(Math.random() * 15 + 5).toFixed(1)}K`,
    trend: ["up", "down", "stable"][index % 3] as "up" | "down" | "stable",
  }));
};

export default function CategoryVotingTable({
  category,
}: CategoryVotingTableProps) {
  const nominees = generateCategoryData(category);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Table Header with Category Info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category} 2024
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vote for your favorite in {category.toLowerCase()}
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Vote Now
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header - Same for all categories */}
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
                Featured Song
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Top Supporters
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
            {nominees.map((nominee) => (
              <TableRow
                key={nominee.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 overflow-hidden rounded-full">
                      <img
                        width={48}
                        height={48}
                        src={nominee.artist.image}
                        alt={nominee.artist.stageName}
                        className="object-cover"
                      />
                      {nominee.trend === "up" && (
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
                      {nominee.trend === "down" && (
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
                        {nominee.artist.stageName}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {nominee.artist.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    {nominee.song}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {nominee.supporters.images.map(
                        (supporterImage, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                          >
                            <img
                              width={24}
                              height={24}
                              src={supporterImage}
                              alt={`Supporter ${index + 1}`}
                              className="w-full size-6"
                            />
                          </div>
                        )
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{nominee.supporters.count}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      nominee.status === "Leading"
                        ? "success"
                        : nominee.status === "Rising"
                          ? "warning"
                          : "default"
                    }
                  >
                    {nominee.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-theme-sm dark:text-white">
                      {nominee.votes}
                    </span>
                    {nominee.trend === "up" && (
                      <span className="text-xs text-green-500">↑ 12%</span>
                    )}
                    {nominee.trend === "down" && (
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
            ))}
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
            <button className="px-3 py-1 text-gray-700 transition-colors border border-gray-200 rounded-lg dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
              Previous
            </button>
            <button className="px-3 py-1 text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
