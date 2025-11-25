import { useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Alert from "../../components/ui/alert/Alert";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  nomineesCount: number;
  votesCount: number;
  status: "active" | "inactive" | "upcoming";
  startDate: string;
  endDate: string;
  icon: string;
}

// Mock data - replace with actual API call
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Best Male Artist",
    slug: "best-male",
    description: "Vote for your favorite male artist of the year",
    nomineesCount: 8,
    votesCount: 15420,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    icon: "👨‍🎤",
  },
  {
    id: "2",
    name: "Best Female Artist",
    slug: "best-female",
    description: "Vote for your favorite female artist of the year",
    nomineesCount: 6,
    votesCount: 12890,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    icon: "👩‍🎤",
  },
  {
    id: "3",
    name: "Song of the Year",
    slug: "song-year",
    description: "Vote for the song of the year",
    nomineesCount: 10,
    votesCount: 18750,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    icon: "🎵",
  },
  {
    id: "4",
    name: "Best Collaboration",
    slug: "collaboration",
    description: "Vote for the best collaboration of the year",
    nomineesCount: 5,
    votesCount: 9340,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    icon: "🤝",
  },
  {
    id: "5",
    name: "Best Newcomer",
    slug: "newcomer",
    description: "Vote for the best newcomer artist of the year",
    nomineesCount: 7,
    votesCount: 7820,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    icon: "⭐",
  },
];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<Category | null>(null);

  const {
    isOpen: isViewOpen,
    openModal: openViewModal,
    closeModal: closeViewModal,
  } = useModal();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      // TODO: Replace with actual API call
      // await deleteCategory(categoryToDelete.id);

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );

      setAlert({
        variant: "success",
        title: "Category Deleted",
        message: `${categoryToDelete.name} has been successfully deleted.`,
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
      setCategoryToDelete(null);
    }
  };

  const handleStatusToggle = async (category: Category) => {
    try {
      // TODO: Replace with actual API call
      const newStatus = category.status === "active" ? "inactive" : "active";

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === category.id ? { ...cat, status: newStatus } : cat
        )
      );

      setAlert({
        variant: "success",
        title: "Status Updated",
        message: `${category.name} is now ${newStatus}.`,
      });

      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        variant: "error",
        title: "Update Failed",
        message: "Failed to update category status.",
      });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleViewClick = (category: Category) => {
    setSelectedCategory(category);
    openViewModal();
  };

  const handleEditClick = (category: Category) => {
    setEditFormData({ ...category });
    openEditModal();
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;

    // TODO: Implement actual save logic with API call
    setCategories((prev) =>
      prev.map((cat) => (cat.id === editFormData.id ? editFormData : cat))
    );

    setAlert({
      variant: "success",
      title: "Category Updated",
      message: `${editFormData.name} has been successfully updated.`,
    });

    setTimeout(() => setAlert(null), 5000);
    closeEditModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "upcoming":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <>
      <PageMeta
        title="Categories Management | Zimdancehall Music Awards"
        description="Manage voting categories for Zimdancehall Music Awards"
      />
      <PageBreadcrumb pageTitle="Categories Management" />

      {alert && (
        <Alert variant={alert.variant} title={alert.title}>
          {alert.message}
        </Alert>
      )}

      <div className="space-y-6">
        <ComponentCard
          title="All Categories"
          action={
            <Link to="/categories/add">
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
                Add Category
              </Button>
            </Link>
          }
        >
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm opacity-90">Total Categories</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {categories.filter((cat) => cat.status === "active").length}
              </div>
              <div className="text-sm opacity-90">Active Categories</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {categories.reduce((sum, cat) => sum + cat.nomineesCount, 0)}
              </div>
              <div className="text-sm opacity-90">Total Nominees</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {categories
                  .reduce((sum, cat) => sum + cat.votesCount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm opacity-90">Total Votes</div>
            </div>
          </div>

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
                      Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Nominees
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
                      Status
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
                  {categories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                              {category.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              /{category.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-xs">
                        <p className="truncate">{category.description}</p>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white">
                          {category.nomineesCount}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className="font-semibold text-gray-800 text-theme-sm dark:text-white">
                          {category.votesCount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <button
                          onClick={() => handleStatusToggle(category)}
                          className="cursor-pointer"
                        >
                          <Badge
                            size="sm"
                            color={getStatusColor(category.status)}
                          >
                            {category.status}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewClick(category)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(category)}
                            className="px-3 py-1 text-xs font-medium text-green-600 transition-colors bg-green-100 rounded-lg hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
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
          </div>
        </ComponentCard>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={closeViewModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Category Details
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              View detailed information about this category.
            </p>
          </div>

          {selectedCategory && (
            <div className="px-2">
              <div className="mb-6 flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                  {selectedCategory.icon}
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    {selectedCategory.name}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {selectedCategory.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Slug
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    /{selectedCategory.slug}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <Badge
                    size="sm"
                    color={getStatusColor(selectedCategory.status)}
                  >
                    {selectedCategory.status}
                  </Badge>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Nominees Count
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {selectedCategory.nomineesCount}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Total Votes
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {selectedCategory.votesCount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(selectedCategory.startDate)}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(selectedCategory.endDate)}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Description
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeViewModal}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    closeViewModal();
                    handleEditClick(selectedCategory);
                  }}
                >
                  Edit Category
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Category Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update category details and settings.
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
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Category Name</Label>
                    <Input
                      name="name"
                      type="text"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Slug</Label>
                    <Input
                      name="slug"
                      type="text"
                      value={editFormData.slug}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Description</Label>
                    <textarea
                      name="description"
                      rows={3}
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Icon (Emoji)</Label>
                    <Input
                      name="icon"
                      type="text"
                      value={editFormData.icon}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Status</Label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Start Date</Label>
                    <Input
                      name="startDate"
                      type="date"
                      value={editFormData.startDate}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>End Date</Label>
                    <Input
                      name="endDate"
                      type="date"
                      value={editFormData.endDate}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nominees Count</Label>
                    <Input
                      name="nomineesCount"
                      type="number"
                      value={editFormData.nomineesCount}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                nomineesCount: parseInt(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Votes Count</Label>
                    <Input
                      name="votesCount"
                      type="number"
                      value={editFormData.votesCount}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                votesCount: parseInt(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Category ID</Label>
                    <Input
                      type="text"
                      value={editFormData.id}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
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
                  Delete Category
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{categoryToDelete.name}"?
                  This action cannot be undone and will remove all associated
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
