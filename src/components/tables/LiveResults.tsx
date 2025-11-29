import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { useVotes, useCategories, useNominees } from "../../hooks";

interface NomineeResult {
  nomineeId: string;
  name: string;
  stageName: string;
  imageUrl: string;
  votes: number;
  percentage: number;
  rank: number;
  trend: "up" | "down" | "stable";
}

interface CategoryResult {
  categoryId: string;
  name: string;
  description: string;
  totalVotes: number;
  nominees: NomineeResult[];
}

// Mock data as fallback
const mockLiveResultsData: CategoryResult[] = [
  {
    categoryId: "1",
    name: "Best Male Artist",
    description: "Leading male artist of the year",
    totalVotes: 45230,
    nominees: [
      {
        nomineeId: "1",
        name: "Desmond Chideme",
        stageName: "Stunner",
        imageUrl: "/images/artists/artist-01.jpg",
        votes: 18500,
        percentage: 40.9,
        rank: 1,
        trend: "up",
      },
      {
        nomineeId: "2",
        name: "Rodney Tafadzwa Munyika",
        stageName: "Seh Calaz",
        imageUrl: "/images/artists/artist-02.jpg",
        votes: 15200,
        percentage: 33.6,
        rank: 2,
        trend: "stable",
      },
      {
        nomineeId: "3",
        name: "Garikai Machembere",
        stageName: "Winky D",
        imageUrl: "/images/artists/artist-05.jpg",
        votes: 11530,
        percentage: 25.5,
        rank: 3,
        trend: "down",
      },
    ],
  },
  {
    categoryId: "2",
    name: "Best Female Artist",
    description: "Leading female artist of the year",
    totalVotes: 38450,
    nominees: [
      {
        nomineeId: "4",
        name: "Tammy Moyo",
        stageName: "Tammy",
        imageUrl: "/images/artists/female-01.jpg",
        votes: 22100,
        percentage: 57.5,
        rank: 1,
        trend: "up",
      },
      {
        nomineeId: "5",
        name: "Janet Manyore",
        stageName: "Jah Signal",
        imageUrl: "/images/artists/female-02.jpg",
        votes: 16350,
        percentage: 42.5,
        rank: 2,
        trend: "stable",
      },
    ],
  },
];

export default function LiveResults() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [liveResults, setLiveResults] = useState<CategoryResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { votes, getAllVotes } = useVotes();
  const { categories, listCategories } = useCategories();
  const { nominees, getAllNominees } = useNominees();

  useEffect(() => {
    fetchLiveResults();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLiveResults();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveResults = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all required data
      await Promise.all([getAllVotes(), listCategories(), getAllNominees()]);

      // Process the data to generate live results
      processLiveResults();
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch live results:", err);
      setError("Failed to load live results. Using sample data.");
      // Fallback to mock data
      setLiveResults(mockLiveResultsData);
    } finally {
      setIsLoading(false);
    }
  };

  const processLiveResults = () => {
    const categoryResults: CategoryResult[] = categories.categories.map(
      (category) => {
        // Get votes for this category
        const categoryVotes = votes.votes.filter(
          (vote) => vote.category?.category_id === category.category_id
        );

        const totalVotes = categoryVotes.length;

        // Group votes by nominee and count them
        const nomineeVotesMap = new Map<string, number>();

        categoryVotes.forEach((vote) => {
          const nomineeId = vote.nominee?.nominee_id;
          if (nomineeId) {
            nomineeVotesMap.set(
              nomineeId,
              (nomineeVotesMap.get(nomineeId) || 0) + 1
            );
          }
        });

        // Create nominee results
        const nomineeResults: NomineeResult[] = Array.from(
          nomineeVotesMap.entries()
        )
          .map(([nomineeId, voteCount]) => {
            const nominee = nominees.nominees.find(
              (n) => n.nominee_id === nomineeId
            );
            const percentage =
              totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

            return {
              nomineeId,
              name: nominee?.name || "Unknown Artist",
              stageName: nominee?.name || "Unknown", // You might want to add stageName to your nominee interface
              imageUrl: nominee?.image_url || "/images/artists/default.jpg",
              votes: voteCount,
              percentage: parseFloat(percentage.toFixed(1)),
              rank: 0, // Will be set after sorting
              trend: "stable" as const, // You can implement trend calculation based on historical data
            };
          })
          .sort((a, b) => b.votes - a.votes)
          .map((nominee, index) => ({
            ...nominee,
            rank: index + 1,
          }));

        return {
          categoryId: category.category_id,
          name: category.name,
          description: category.description || `${category.name} category`,
          totalVotes,
          nominees: nomineeResults,
        };
      }
    );

    setLiveResults(
      categoryResults.length > 0 ? categoryResults : mockLiveResultsData
    );
  };

  const filteredResults =
    selectedCategory === "all"
      ? liveResults
      : liveResults.filter((cat) => cat.categoryId === selectedCategory);

  const formatVotes = (votes: number) => {
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return (
        <svg
          className="w-4 h-4 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (trend === "down") {
      return (
        <svg
          className="w-4 h-4 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-600";
    return "text-gray-500";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return "Today";
  };

  const totalVotesAcrossAll = liveResults.reduce(
    (sum, cat) => sum + cat.totalVotes,
    0
  );

  const topNominee = liveResults[0]?.nominees[0];

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Live Results | Zimdancehall Music Awards"
          description="View real-time voting results across all categories"
        />
        <PageBreadcrumb pageTitle="Live Results" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading live results...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Live Results | Zimdancehall Music Awards"
        description="View real-time voting results across all categories"
      />
      <PageBreadcrumb pageTitle="Live Results" />

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-yellow-700 dark:text-yellow-400">
              {error}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Total Votes</span>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">
              {formatVotes(totalVotesAcrossAll)}
            </div>
            <div className="text-xs opacity-75 mt-1">Across all categories</div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Categories</span>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">{liveResults.length}</div>
            <div className="text-xs opacity-75 mt-1">Active voting</div>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Top Nominee</span>
              <div className="p-2 bg-white/20 rounded-lg">
                <span className="text-lg">🥇</span>
              </div>
            </div>
            <div className="text-lg font-bold truncate">
              {topNominee?.stageName || "N/A"}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {formatVotes(topNominee?.votes || 0)} votes
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Last Updated</span>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="text-lg font-bold">{getTimeAgo(lastUpdated)}</div>
            <div className="text-xs opacity-75 mt-1">Auto-refreshing</div>
          </div>
        </div>

        {/* Filter and View Controls */}
        <ComponentCard title="Voting Results">
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {liveResults.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-8">
            {filteredResults.map((category) => (
              <div key={category.categoryId} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                  <Badge size="sm" color="default">
                    {formatVotes(category.totalVotes)} votes
                  </Badge>
                </div>

                {/* Nominees */}
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {category.nominees.map((nominee) => (
                      <div
                        key={nominee.nomineeId}
                        className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
                      >
                        {/* Progress Bar Background */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                          style={{ width: `${nominee.percentage}%` }}
                        />

                        <div className="relative p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Rank */}
                              <div
                                className={`text-3xl font-bold ${getRankColor(nominee.rank)}`}
                              >
                                {getRankBadge(nominee.rank)}
                              </div>

                              {/* Artist Info */}
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                  <img
                                    src={nominee.imageUrl}
                                    alt={nominee.stageName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {nominee.stageName}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {nominee.name}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {nominee.percentage}%
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatVotes(nominee.votes)} votes
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(nominee.trend)}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${nominee.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.nominees.map((nominee) => (
                      <div
                        key={nominee.nomineeId}
                        className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
                      >
                        {/* Rank Badge */}
                        <div className="absolute top-4 right-4">
                          <div
                            className={`text-2xl ${getRankColor(nominee.rank)}`}
                          >
                            {getRankBadge(nominee.rank)}
                          </div>
                        </div>

                        {/* Artist Image */}
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                          <img
                            src={nominee.imageUrl}
                            alt={nominee.stageName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Artist Info */}
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {nominee.stageName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {nominee.name}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-purple-500">
                            {nominee.percentage}%
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatVotes(nominee.votes)} votes
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${nominee.percentage}%` }}
                          />
                        </div>

                        {/* Trend */}
                        <div className="flex items-center justify-center gap-1 mt-3">
                          {getTrendIcon(nominee.trend)}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {nominee.trend === "up"
                              ? "Rising"
                              : nominee.trend === "down"
                                ? "Falling"
                                : "Stable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
