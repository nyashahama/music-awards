import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface CategoryPerformance {
  categoryId: string;
  name: string;
  totalVotes: number;
  uniqueVoters: number;
  averageVotesPerVoter: number;
  participationRate: number;
  trend: "up" | "down" | "stable";
}

interface TopNominee {
  nomineeId: string;
  name: string;
  stageName: string;
  category: string;
  votes: number;
  percentage: number;
  imageUrl: string;
}

// interface VotingPattern {
//   hour: string;
//   votes: number;
// }

// Mock data
const categoryPerformanceData: CategoryPerformance[] = [
  {
    categoryId: "1",
    name: "Best Male Artist",
    totalVotes: 45230,
    uniqueVoters: 12400,
    averageVotesPerVoter: 3.6,
    participationRate: 85.2,
    trend: "up",
  },
  {
    categoryId: "2",
    name: "Best Female Artist",
    totalVotes: 38450,
    uniqueVoters: 10800,
    averageVotesPerVoter: 3.6,
    participationRate: 74.1,
    trend: "up",
  },
  {
    categoryId: "3",
    name: "Song of the Year",
    totalVotes: 52800,
    uniqueVoters: 15600,
    averageVotesPerVoter: 3.4,
    participationRate: 92.5,
    trend: "stable",
  },
  {
    categoryId: "4",
    name: "Best Newcomer",
    totalVotes: 28600,
    uniqueVoters: 8900,
    averageVotesPerVoter: 3.2,
    participationRate: 68.9,
    trend: "down",
  },
  {
    categoryId: "5",
    name: "Best Collaboration",
    totalVotes: 34200,
    uniqueVoters: 9500,
    averageVotesPerVoter: 3.6,
    participationRate: 71.3,
    trend: "up",
  },
];

const topNomineesData: TopNominee[] = [
  {
    nomineeId: "1",
    name: "Garikai Machembere",
    stageName: "Winky D",
    category: "Song of the Year",
    votes: 28900,
    percentage: 54.7,
    imageUrl: "/images/artists/artist-05.jpg",
  },
  {
    nomineeId: "2",
    name: "Tammy Moyo",
    stageName: "Tammy",
    category: "Best Female Artist",
    votes: 22100,
    percentage: 57.5,
    imageUrl: "/images/artists/female-01.jpg",
  },
  {
    nomineeId: "3",
    name: "Desmond Chideme",
    stageName: "Stunner",
    category: "Best Male Artist",
    votes: 18500,
    percentage: 40.9,
    imageUrl: "/images/artists/artist-01.jpg",
  },
];

export default function VotingAnalyticsReports() {
  const [dateRange, setDateRange] = useState("30days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Voting patterns by hour
  const votingPatternsOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      categories: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "24:00",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Votes" },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      x: { format: "HH:mm" },
    },
  };

  const votingPatternsSeries = [
    {
      name: "Votes",
      data: [245, 180, 320, 580, 1200, 1850, 2100, 1950, 890],
    },
  ];

  // Category distribution pie chart
  const categoryDistributionOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: categoryPerformanceData.map((cat) => cat.name),
    colors: ["#465FFF", "#9CB9FF", "#10B981", "#F59E0B", "#EF4444"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return Math.round(val) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const categoryDistributionSeries = categoryPerformanceData.map(
    (cat) => cat.totalVotes
  );

  // Daily votes trend
  const dailyVotesTrendOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#465FFF", "#10B981"],
    stroke: { curve: "smooth", width: [3, 3] },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Votes" },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  const dailyVotesTrendSeries = [
    {
      name: "This Week",
      data: [3200, 4100, 3800, 4500, 5200, 6800, 7200],
    },
    {
      name: "Last Week",
      data: [2800, 3500, 3200, 3900, 4200, 5100, 5800],
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
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

  const totalVotes = categoryPerformanceData.reduce(
    (sum, cat) => sum + cat.totalVotes,
    0
  );
  const totalUniqueVoters = new Set(
    categoryPerformanceData.flatMap((cat) => cat.uniqueVoters)
  ).size;
  const averageParticipationRate = (
    categoryPerformanceData.reduce(
      (sum, cat) => sum + cat.participationRate,
      0
    ) / categoryPerformanceData.length
  ).toFixed(1);

  return (
    <>
      <PageMeta
        title="Voting Analytics Reports | Zimdancehall Music Awards"
        description="Comprehensive voting analytics and performance reports"
      />
      <PageBreadcrumb pageTitle="Voting Analytics Reports" />

      <div className="space-y-6">
        {/* Filter Controls */}
        <ComponentCard title="Report Filters">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
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
                  {categoryPerformanceData.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                Export PDF
              </button>
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors">
                Export Excel
              </button>
            </div>
          </div>
        </ComponentCard>

        {/* Key Metrics */}
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
            <div className="text-3xl font-bold">{formatNumber(totalVotes)}</div>
            <div className="text-xs opacity-75 mt-1">Across all categories</div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Unique Voters</span>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">
              {formatNumber(totalUniqueVoters)}
            </div>
            <div className="text-xs opacity-75 mt-1">Active participants</div>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Participation Rate</span>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold">
              {averageParticipationRate}%
            </div>
            <div className="text-xs opacity-75 mt-1">
              Average across categories
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Active Categories</span>
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
            <div className="text-3xl font-bold">
              {categoryPerformanceData.length}
            </div>
            <div className="text-xs opacity-75 mt-1">With active voting</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voting Patterns by Time */}
          <ComponentCard title="Voting Patterns by Time">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Peak voting hours throughout the day
            </p>
            <Chart
              options={votingPatternsOptions}
              series={votingPatternsSeries}
              type="area"
              height={300}
            />
          </ComponentCard>

          {/* Category Distribution */}
          <ComponentCard title="Category Distribution">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Vote distribution across categories
            </p>
            <Chart
              options={categoryDistributionOptions}
              series={categoryDistributionSeries}
              type="donut"
              height={300}
            />
          </ComponentCard>
        </div>

        {/* Daily Votes Trend */}
        <ComponentCard title="Weekly Voting Trends">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Comparison of current week vs previous week
          </p>
          <Chart
            options={dailyVotesTrendOptions}
            series={dailyVotesTrendSeries}
            type="line"
            height={300}
          />
        </ComponentCard>

        {/* Category Performance Table */}
        <ComponentCard title="Category Performance Analysis">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Category
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Total Votes
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Unique Voters
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Avg Votes/Voter
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Participation
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Trend
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {categoryPerformanceData.map((category) => (
                    <TableRow
                      key={category.categoryId}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-semibold text-gray-800 dark:text-white/90">
                          {category.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatNumber(category.totalVotes)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatNumber(category.uniqueVoters)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {category.averageVotesPerVoter.toFixed(1)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge
                          size="sm"
                          color={
                            category.participationRate >= 80
                              ? "success"
                              : category.participationRate >= 60
                                ? "warning"
                                : "error"
                          }
                        >
                          {category.participationRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          {getTrendIcon(category.trend)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>

        {/* Top Performers */}
        <ComponentCard title="Top Performing Nominees">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topNomineesData.map((nominee, index) => (
              <div
                key={nominee.nomineeId}
                className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6"
              >
                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`text-2xl ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-600"}`}
                  >
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                </div>

                {/* Artist Image */}
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
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
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {nominee.category}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-500">
                    {nominee.percentage}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatNumber(nominee.votes)} votes
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${nominee.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
