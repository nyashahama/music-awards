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
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

interface Nominee {
  id: number;
  artist: {
    image: string;
    name: string;
    stageName: string;
  };
  category: string;
  song: string;
  status: "active" | "pending" | "disqualified";
  votes: number;
  dateAdded: string;
}

const allNomineesData: Nominee[] = [
  {
    id: 1,
    artist: {
      image: "/images/artists/artist-01.jpg",
      name: "Desmond Chideme",
      stageName: "Stunner",
    },
    category: "Best Male Artist",
    song: "Dzimba Remabwe",
    status: "active",
    votes: 12400,
    dateAdded: "2024-01-15",
  },
  {
    id: 2,
    artist: {
      image: "/images/artists/artist-02.jpg",
      name: "Rodney Tafadzwa Munyika",
      stageName: "Seh Calaz",
    },
    category: "Best Male Artist",
    song: "Mabhanditi",
    status: "active",
    votes: 8900,
    dateAdded: "2024-01-16",
  },
  {
    id: 3,
    artist: {
      image: "/images/artists/female-01.jpg",
      name: "Tammy Moyo",
      stageName: "Tammy",
    },
    category: "Best Female Artist",
    song: "Sweet Love",
    status: "active",
    votes: 9800,
    dateAdded: "2024-01-14",
  },
  {
    id: 4,
    artist: {
      image: "/images/artists/artist-05.jpg",
      name: "Garikai Machembere",
      stageName: "Winky D",
    },
    category: "Song of the Year",
    song: "Disappear",
    status: "active",
    votes: 15600,
    dateAdded: "2024-01-10",
  },
  {
    id: 5,
    artist: {
      image: "/images/artists/newcomer-01.jpg",
      name: "Talent Mapeza",
      stageName: "Young Talent",
    },
    category: "Best Newcomer",
    song: "First Step",
    status: "pending",
    votes: 4500,
    dateAdded: "2024-01-20",
  },
];

export default function AllNominees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [editFormData, setEditFormData] = useState<Nominee | null>(null);

  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const categories = [
    ...new Set(allNomineesData.map((nominee) => nominee.category)),
  ];

  const filteredNominees = allNomineesData.filter((nominee) => {
    const matchesSearch =
      nominee.artist.stageName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      nominee.song.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || nominee.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || nominee.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatVotes = (votes: number) => {
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "disqualified":
        return "error";
      default:
        return "default";
    }
  };

  const handleEditClick = (nominee: Nominee) => {
    setEditFormData({ ...nominee });
    openEditModal();
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveEdit = () => {
    // TODO: Implement actual save logic with API call
    console.log("Saving nominee changes:", editFormData);
    closeEditModal();
  };

  return (
    <>
      <PageMeta
        title="All Nominees | Zimdancehall Music Awards"
        description="Manage all nominees across all categories"
      />
      <PageBreadcrumb pageTitle="All Nominees" />

      <div className="space-y-6">
        <ComponentCard title="Nominees Management">
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by artist or song..."
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
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                  Export Data
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
                      Artist
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
                      Song
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
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Date Added
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
                  {filteredNominees.map((nominee) => (
                    <TableRow
                      key={nominee.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                              width={40}
                              height={40}
                              src={nominee.artist.image}
                              alt={nominee.artist.stageName}
                              className="object-cover"
                            />
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
                        {nominee.category}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {nominee.song}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={getStatusColor(nominee.status)}>
                          {nominee.status.charAt(0).toUpperCase() +
                            nominee.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatVotes(nominee.votes)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(nominee.dateAdded).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditClick(nominee)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                          >
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200">
                            Remove
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
                  Showing {filteredNominees.length} of {allNomineesData.length}{" "}
                  nominees
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Nominee Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update nominee details and status.
            </p>
          </div>

          {editFormData && (
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  {/* Artist Image Preview */}
                  <div className="col-span-2 flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 overflow-hidden rounded-full">
                      <img
                        width={80}
                        height={80}
                        src={editFormData.artist.image}
                        alt={editFormData.artist.stageName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white/90">
                        {editFormData.artist.stageName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {editFormData.artist.name}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Stage Name</Label>
                    <Input
                      name="stageName"
                      type="text"
                      value={editFormData.artist.stageName}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                artist: {
                                  ...prev.artist,
                                  stageName: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Real Name</Label>
                    <Input
                      name="artistName"
                      type="text"
                      value={editFormData.artist.name}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                artist: {
                                  ...prev.artist,
                                  name: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Category</Label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleSelectChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <Label>Song</Label>
                    <Input
                      name="song"
                      type="text"
                      value={editFormData.song}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Status</Label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleSelectChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="disqualified">Disqualified</option>
                    </select>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Votes</Label>
                    <Input
                      name="votes"
                      type="number"
                      value={editFormData.votes}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                votes: parseInt(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Nominee ID</Label>
                    <Input
                      type="text"
                      value={editFormData.id}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Date Added</Label>
                    <Input
                      type="text"
                      value={new Date(
                        editFormData.dateAdded
                      ).toLocaleDateString()}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeEditModal}>
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
