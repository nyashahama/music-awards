import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { UserVoteResponse } from "../../api/services/voteService";
import { useMemo } from "react";

interface VotingStatisticsProps {
  votes?: UserVoteResponse[];
  isLoading?: boolean;
}

export default function VotingStatistics({
  votes = [],
  isLoading = false,
}: VotingStatisticsProps) {
  // Process votes to get monthly data
  const chartData = useMemo(() => {
    if (votes.length === 0) {
      // Fallback to mock data
      return {
        totalVotes: [
          1800, 1900, 1700, 1600, 1750, 1650, 1700, 2050, 2300, 2100, 2400,
          2350,
        ],
        newVoters: [
          400, 300, 500, 400, 550, 400, 700, 1000, 1100, 1200, 1500, 1400,
        ],
      };
    }

    // Group votes by month
    const monthlyVotes = Array(12).fill(0);
    //const monthlyVoters = new Map<string, Set<string>>(); // Track unique voters per month

    votes.forEach((vote) => {
      const date = new Date(vote.created_at);
      const month = date.getMonth();

      // Count total votes
      monthlyVotes[month] = (monthlyVotes[month] || 0) + 1;

      // Track unique voters (mock implementation - would need user_id in vote data)
      // For now, we'll use mock data for new voters
    });

    return {
      totalVotes: monthlyVotes,
      newVoters: [
        400, 300, 500, 400, 550, 400, 700, 1000, 1100, 1200, 1500, 1400,
      ], // Mock for now
    };
  }, [votes]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Total Votes",
      data: chartData.totalVotes,
    },
    {
      name: "New Voters",
      data: chartData.newVoters,
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
          <div className="w-full space-y-2">
            <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
          </div>
        </div>
        <div className="h-80 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Voting Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly voting trends and voter growth
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
