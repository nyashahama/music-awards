import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoryVotingTable from "../../components/tables/CategoryVotingTable";
import { useCategories } from "../../hooks";
import { Category } from "../../api/services";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategory } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setError("Category ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const categoryData = await getCategory(categoryId);
        setCategory(categoryData);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setError("Failed to load category. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, getCategory]);

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Loading... | Zimdancehall Music Awards"
          description="Loading category information"
        />
        <PageBreadcrumb pageTitle="Loading..." />
        <div className="space-y-6">
          <ComponentCard title="Loading Category">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Loading category...
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <PageMeta
          title="Error | Zimdancehall Music Awards"
          description="Category not found"
        />
        <PageBreadcrumb pageTitle="Error" />
        <div className="space-y-6">
          <ComponentCard title="Category Not Found">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {error || "Category not found"}
                </p>
                <a
                  href="/categories"
                  className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white transition-colors bg-purple-500 rounded-lg hover:bg-purple-600"
                >
                  Back to Categories
                </a>
              </div>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  const displayTitle = category.name;
  const displayDescription = category.description;

  return (
    <>
      <PageMeta
        title={`${displayTitle} | Zimdancehall Music Awards`}
        description={displayDescription}
      />
      <PageBreadcrumb pageTitle={displayTitle} />
      <div className="space-y-6">
        {/* Category Info Card */}
        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <div className="flex items-center gap-4">
            {category.icon && (
              <div className="flex items-center justify-center w-16 h-16 text-4xl bg-white rounded-full">
                {category.icon}
              </div>
            )}
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold">{displayTitle}</h1>
              <p className="mt-1 text-sm opacity-90">{displayDescription}</p>
              <div className="flex gap-4 mt-3 text-sm">
                <div>
                  <span className="font-semibold">
                    {category.nomineesCount || 0}
                  </span>{" "}
                  Nominees
                </div>
                <div>
                  <span className="font-semibold">
                    {(category.votesCount || 0).toLocaleString()}
                  </span>{" "}
                  Votes
                </div>
                <div>
                  Status:{" "}
                  <span className="font-semibold">
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Table */}
        <ComponentCard title={`${displayTitle} 2024 Voting`}>
          {category.is_active ? (
            <CategoryVotingTable
              categoryId={category.category_id}
              categoryName={category.name}
            />
          ) : (
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  Voting Closed
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This category is currently not accepting votes.
                </p>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
