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
                            color={
                              category.status === "active"
                                ? "success"
                                : category.status === "upcoming"
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {category.status}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/categories/edit/${category.id}`}>
                            <button
                              className="p-2 text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
                              title="Edit Category"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </Link>
                          <Link to={`/${category.slug}`}>
                            <button
                              className="p-2 text-green-500 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10"
                              title="View Category"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Delete Category"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
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
