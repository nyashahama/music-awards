import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";

interface VotingActivity {
  voteId: string;
  voter: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  nominee: {
    artistName: string;
    stageName: string;
  };
  category: string;
  votedAt: string;
  ipAddress: string;
  location: string;
}

// Mock data - replace with actual API call
const votingActivityData: VotingActivity[] = [
  {
    voteId: "1",
    voter: {
      userId: "1",
      firstName: "Tendai",
      lastName: "Moyo",
      email: "tendai.moyo@example.com",
    },
    nominee: {
      artistName: "Desmond Chideme",
      stageName: "Stunner",
    },
    category: "Best Male Artist",
    votedAt: "2024-01-20T14:30:00Z",
    ipAddress: "41.79.xxx.xxx",
    location: "Harare",
  },
  {
    voteId: "2",
    voter: {
      userId: "2",
      firstName: "Rudo",
      lastName: "Chikwanha",
      email: "rudo.chikwanha@example.com",
    },
    nominee: {
      artistName: "Tammy Moyo",
      stageName: "Tammy",
    },
    category: "Best Female Artist",
    votedAt: "2024-01-20T13:15:00Z",
    ipAddress: "41.79.xxx.xxx",
    location: "Bulawayo",
  },
  {
    voteId: "3",
    voter: {
      userId: "3",
      firstName: "Takudzwa",
      lastName: "Nyathi",
      email: "takudzwa.nyathi@example.com",
    },
    nominee: {
      artistName: "Garikai Machembere",
      stageName: "Winky D",
    },
    category: "Song of the Year",
    votedAt: "2024-01-20T12:45:00Z",
    ipAddress: "41.79.xxx.xxx",
    location: "Mutare",
  },
  {
    voteId: "4",
    voter: {
      userId: "1",
      firstName: "Tendai",
      lastName: "Moyo",
      email: "tendai.moyo@example.com",
    },
    nominee: {
      artistName: "Rodney Tafadzwa Munyika",
      stageName: "Seh Calaz",
    },
    category: "Best Male Artist",
    votedAt: "2024-01-20T11:20:00Z",
    ipAddress: "41.79.xxx.xxx",
    location: "Harare",
  },
  {
    voteId: "5",
    voter: {
      userId: "5",
      firstName: "Panashe",
      lastName: "Gumbo",
      email: "panashe.gumbo@example.com",
    },
    nominee: {
      artistName: "Talent Mapeza",
      stageName: "Young Talent",
    },
    category: "Best Newcomer",
    votedAt: "2024-01-20T10:30:00Z",
    ipAddress: "41.79.xxx.xxx",
    location: "Harare",
  },
  {
    voteId: "6",
    voter: {
      userId: "6",
      firstName: "Kudzai",
      lastName: "Madziva",
      email: "kudzai.madziva@example.com",
    },
    nominee: {
      artistName: "Stunner ft. Enzo Ishall",
      stageName: "Stunner & Enzo",
    },
    category: "Best Collaboration",
    votedAt: "2024-01-20T09:15:00Z",
    ipAddress: "41.79.xxx.xxx",
    location: "Masvingo",
  },
];

export default function VotingActivity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] =
    useState<VotingActivity | null>(null);
  const [flagReason, setFlagReason] = useState("");

  const {
    isOpen: isDetailsOpen,
    openModal: openDetailsModal,
    closeModal: closeDetailsModal,
  } = useModal();
  const {
    isOpen: isFlagOpen,
    openModal: openFlagModal,
    closeModal: closeFlagModal,
  } = useModal();

  const categories = [
    ...new Set(votingActivityData.map((activity) => activity.category)),
  ];

  const locations = [
    ...new Set(votingActivityData.map((activity) => activity.location)),
  ];

  const filteredActivity = votingActivityData.filter((activity) => {
    const matchesSearch =
      activity.voter.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      activity.voter.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      activity.nominee.stageName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || activity.category === categoryFilter;
    const matchesLocation =
      locationFilter === "all" || activity.location === locationFilter;

    // Date filter logic
    let matchesDate = true;
    if (dateFilter !== "all") {
      const voteDate = new Date(activity.votedAt);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - voteDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dateFilter === "today") matchesDate = daysDiff === 0;
      else if (dateFilter === "week") matchesDate = daysDiff <= 7;
      else if (dateFilter === "month") matchesDate = daysDiff <= 30;
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const voteDate = new Date(dateString);
    const diffMs = now.getTime() - voteDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleDetailsClick = (activity: VotingActivity) => {
    setSelectedActivity(activity);
    openDetailsModal();
  };

  const handleFlagClick = (activity: VotingActivity) => {
    setSelectedActivity(activity);
    setFlagReason("");
    openFlagModal();
  };

  const handleSubmitFlag = () => {
    // TODO: Implement actual flag submission logic with API call
    console.log(
      "Flagging vote:",
      selectedActivity?.voteId,
      "Reason:",
      flagReason
    );
    closeFlagModal();
  };

  return (
    <>
      <PageMeta
        title="Voting Activity | Zimdancehall Music Awards"
        description="Track all voting activity and analytics"
      />
      <PageBreadcrumb pageTitle="Voting Activity" />

      <div className="space-y-6">
        <ComponentCard title="Voting Activity Analytics">
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {votingActivityData.length}
              </div>
              <div className="text-sm opacity-90">Total Votes Cast</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {new Set(votingActivityData.map((v) => v.voter.userId)).size}
              </div>
              <div className="text-sm opacity-90">Unique Voters</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm opacity-90">Active Categories</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {
                  votingActivityData.filter((v) => {
                    const voteDate = new Date(v.votedAt);
                    const today = new Date();
                    return voteDate.toDateString() === today.toDateString();
                  }).length
                }
              </div>
              <div className="text-sm opacity-90">Votes Today</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search voter or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Voter
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Voted For
                    </TableCell>
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
                      Location
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      IP Address
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {filteredActivity.map((activity) => (
                    <TableRow
                      key={activity.voteId}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {activity.voter.firstName.charAt(0)}
                            {activity.voter.lastName.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                              {activity.voter.firstName}{" "}
                              {activity.voter.lastName}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {activity.voter.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div>
                          <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                            {activity.nominee.stageName}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {activity.nominee.artistName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color="default">
                          {activity.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {activity.location}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {activity.ipAddress}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div>
                          <span className="block text-gray-800 text-theme-sm dark:text-white/90">
                            {formatDateTime(activity.votedAt)}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {getTimeAgo(activity.votedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDetailsClick(activity)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleFlagClick(activity)}
                            className="px-3 py-1 text-xs font-medium text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                          >
                            Flag
                          </button>
                        </div>
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
                  Showing {filteredActivity.length} of{" "}
                  {votingActivityData.length} votes
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
        </ComponentCard>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
        className="max-w-[800px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Vote Details
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Complete information about this voting activity.
            </p>
          </div>

          {selectedActivity && (
            <div className="px-2">
              {/* Vote ID Section */}
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Vote ID
                    </p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      #{selectedActivity.voteId}
                    </p>
                  </div>
                  <Badge size="sm" color="success">
                    Verified
                  </Badge>
                </div>
              </div>

              {/* Voter Information */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Voter Information
                </h5>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {selectedActivity.voter.firstName.charAt(0)}
                    {selectedActivity.voter.lastName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white/90">
                      {selectedActivity.voter.firstName}{" "}
                      {selectedActivity.voter.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedActivity.voter.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      User ID: {selectedActivity.voter.userId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nominee Information */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Voted For
                </h5>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold text-xl">
                      {selectedActivity.nominee.stageName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-white/90 text-lg">
                        {selectedActivity.nominee.stageName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedActivity.nominee.artistName}
                      </p>
                      <div className="mt-2">
                        <Badge size="sm" color="default">
                          {selectedActivity.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote Metadata */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Vote Metadata
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Timestamp
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {formatDateTime(selectedActivity.votedAt)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ({getTimeAgo(selectedActivity.votedAt)})
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {selectedActivity.location}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      IP Address
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {selectedActivity.ipAddress}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </p>
                    <Badge size="sm" color="default">
                      {selectedActivity.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeDetailsModal}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    closeDetailsModal();
                    handleFlagClick(selectedActivity);
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Flag Vote
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
