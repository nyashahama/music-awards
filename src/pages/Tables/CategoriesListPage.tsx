import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { useCategories } from "../../hooks";
import { Category } from "../../api/services";

export default function CategoriesListPage() {
  const { categories, listActiveCategories } = useCategories();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        await listActiveCategories();
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [listActiveCategories]);

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Voting Categories | Zimdancehall Music Awards"
          description="Browse all voting categories"
        />
        <PageBreadcrumb pageTitle="Voting Categories" />
        <div className="space-y-6">
          <ComponentCard title="Loading Categories">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Loading categories...
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Voting Categories | Zimdancehall Music Awards"
        description="Browse all voting categories and cast your votes"
      />
      <PageBreadcrumb pageTitle="Voting Categories" />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold">Vote for Your Favorites</h1>
            <p className="mt-2 text-sm opacity-90">
              Choose from {categories.categories.length} active categories and
              make your voice heard
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.categories.map((category: Category) => (
            <Link
              key={category.category_id}
              to={`/category/${category.category_id}`}
              className="block"
            >
              <div className="h-full p-6 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:scale-105 dark:bg-white/[0.03] dark:border-white/[0.05]">
                {/* Category Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto text-4xl bg-gradient-to-br from-purple-100 to-pink-100 rounded-full dark:from-purple-900/20 dark:to-pink-900/20">
                  {category.icon || "🏆"}
                </div>

                {/* Category Name */}
                <h3 className="mt-4 text-xl font-semibold text-center text-gray-900 dark:text-white">
                  {category.name}
                </h3>

                {/* Category Description */}
                <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400 line-clamp-2">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {category.nomineesCount || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      nominees
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-pink-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {(category.votesCount || 0).toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      votes
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mt-4">
                  <Badge
                    size="sm"
                    color={category.is_active ? "success" : "default"}
                  >
                    {category.is_active ? "Active" : "Closed"}
                  </Badge>
                </div>

                {/* Vote Button */}
                <div className="mt-4">
                  <div className="w-full px-4 py-2 text-sm font-medium text-center text-white transition-colors rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    View & Vote
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.categories.length === 0 && (
          <ComponentCard title="No Categories Available">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  No categories available yet
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Check back soon for voting categories
                </p>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </>
  );
}
