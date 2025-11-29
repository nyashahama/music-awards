import { useEffect, useState } from "react";
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
import { Nominee, UpdateNomineeRequest } from "../../api/services";
import { Link } from "react-router";
import { useNominees } from "../../hooks";
import Alert from "../ui/alert/Alert";

// interface Nominee {
//   id: number;
//   artist: {
//     image: string;
//     name: string;
//     stageName: string;
//   };
//   category: string;
//   song: string;
//   status: "active" | "pending" | "disqualified";
//   votes: number;
//   dateAdded: string;
// }

// const allNomineesData: Nominee[] = [
//   {
//     id: 1,
//     artist: {
//       image: "/images/artists/artist-01.jpg",
//       name: "Desmond Chideme",
//       stageName: "Stunner",
//     },
//     category: "Best Male Artist",
//     song: "Dzimba Remabwe",
//     status: "active",
//     votes: 12400,
//     dateAdded: "2024-01-15",
//   },
//   {
//     id: 2,
//     artist: {
//       image: "/images/artists/artist-02.jpg",
//       name: "Rodney Tafadzwa Munyika",
//       stageName: "Seh Calaz",
//     },
//     category: "Best Male Artist",
//     song: "Mabhanditi",
//     status: "active",
//     votes: 8900,
//     dateAdded: "2024-01-16",
//   },
//   {
//     id: 3,
//     artist: {
//       image: "/images/artists/female-01.jpg",
//       name: "Tammy Moyo",
//       stageName: "Tammy",
//     },
//     category: "Best Female Artist",
//     song: "Sweet Love",
//     status: "active",
//     votes: 9800,
//     dateAdded: "2024-01-14",
//   },
//   {
//     id: 4,
//     artist: {
//       image: "/images/artists/artist-05.jpg",
//       name: "Garikai Machembere",
//       stageName: "Winky D",
//     },
//     category: "Song of the Year",
//     song: "Disappear",
//     status: "active",
//     votes: 15600,
//     dateAdded: "2024-01-10",
//   },
//   {
//     id: 5,
//     artist: {
//       image: "/images/artists/newcomer-01.jpg",
//       name: "Talent Mapeza",
//       stageName: "Young Talent",
//     },
//     category: "Best Newcomer",
//     song: "First Step",
//     status: "pending",
//     votes: 4500,
//     dateAdded: "2024-01-20",
//   },
// ];

export default function AllNominees() {
  const { nominees, getAllNominees, deleteNominee, updateNominee } =
    useNominees();
  const [isUpdating, setIsUpdating] = useState(false);
  const [nomineeToDelete, setNomineeToDelete] = useState<Nominee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [editFormData, setEditFormData] = useState<Nominee | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const categories = [
    ...new Set(nominees.nominees.map((nominee) => nominee.category)),
  ];

  const filteredNominees = nominees.nominees.filter((nominee) => {
    const matchesSearch =
      nominee.artist?.stageName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (nominee.song || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || nominee.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || nominee.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatVotes = (votes?: number) => {
    if ((votes || 0) >= 1000) {
      return `${((votes || 0) / 1000).toFixed(1)}K`;
    }
    return (votes || 0).toString();
  };

  const getStatusColor = (status?: string) => {
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

  useEffect(() => {
    getAllNominees();
  }, []);

  const handleEditClick = (nominee: Nominee) => {
    setEditFormData({ ...nominee });
    openEditModal();
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev: Nominee | null) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleDeleteClick = (nominee: Nominee) => {
    setNomineeToDelete(nominee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!nomineeToDelete) return;

    try {
      await deleteNominee(nomineeToDelete.nominee_id);

      setAlert({
        variant: "success",
        title: "Category Deleted",
        message: `${nomineeToDelete.name} has been successfully deleted.`,
      });

      setTimeout(() => setAlert(null), 5000);
    } catch (error) {
      setAlert({
        variant: "error",
        title: "Delete Failed",
        message: "Failed to delete category. Please try again.",
      });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setShowDeleteModal(false);
      setNomineeToDelete(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;
    setIsUpdating(true);
    try {
      const updateData: UpdateNomineeRequest = {
        name: editFormData.name,
        description: editFormData.description,
        sample_works: editFormData.sample_works,
        image_url: editFormData.image_url,
      };
      await updateNominee(editFormData.nominee_id, updateData);
      setIsUpdating(false);
      setAlert({
        variant: "success",
        title: "Nominee Updated",
        message: `${editFormData.name} has been successfully updated.`,
      });

      setTimeout(() => setAlert(null), 5000);
      closeEditModal();
    } catch (error) {
      setAlert({
        variant: "error",
        title: "Nominee update failed",
        message: `${editFormData.name} has been failed to update.`,
      });

      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const getNomineeName = (nominee: Nominee) =>
    nominee.artist?.stageName || nominee.name || "N/A";

  const getNomineeImage = (nominee: Nominee) => {
    return nominee.artist?.image || nominee.image_url || "";
  };

  return (
    <>
      <PageMeta
        title="All Nominees | Zimdancehall Music Awards"
        description="Manage all nominees across all categories"
      />
      <PageBreadcrumb pageTitle="All Nominees" />

      {alert && (
        <Alert variant={alert.variant} title={alert.title}>
          {alert.message}
        </Alert>
      )}

      <div className="space-y-6">
        <ComponentCard title="Nominees Management">
          <div className="flex justify-end mb-4">
            <Link to="/add-nominee">
              <Button size="sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Nominee
              </Button>
            </Link>
          </div>
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
                      key={nominee.nominee_id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                              width={40}
                              height={40}
                              src={getNomineeImage(nominee)}
                              alt={getNomineeName(nominee)}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                              {getNomineeName(nominee)}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {nominee.artist?.name}
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
                          {(nominee.status || "active")
                            .charAt(0)
                            .toUpperCase() + nominee.status ||
                            "active".slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatVotes(nominee.votes)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(nominee.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditClick(nominee)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(nominee)}
                            className="px-3 py-1 text-xs font-medium text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                          >
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
                  Showing {filteredNominees.length} of{" "}
                  {nominees.nominees.length} nominees
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
                        src={editFormData.artist?.image}
                        alt={editFormData.artist?.stageName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white/90">
                        {editFormData.artist?.stageName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {editFormData.artist?.name}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Stage Name</Label>
                    <Input
                      name="stageName"
                      type="text"
                      value={editFormData.artist?.stageName}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Real Name</Label>
                    <Input
                      name="artistName"
                      type="text"
                      value={editFormData.artist?.name}
                      onChange={handleEditInputChange}
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
                      value={editFormData.nominee_id}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Date Added</Label>
                    <Input
                      type="text"
                      value={new Date(
                        editFormData.created_at
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
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && nomineeToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg dark:bg-gray-900">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  Delete Nominee
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{nomineeToDelete.name}"? This
                  action cannot be undone and will remove all associated
                  nominees and votes.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
