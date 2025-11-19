import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoryVotingTable from "../../components/tables/CategoryVotingTable";

// Category configuration
const categoryConfig = {
  "best-male": {
    title: "Best Male Artist",
    description: "Vote for your favorite male artist of the year",
  },
  "best-female": {
    title: "Best Female Artist",
    description: "Vote for your favorite female artist of the year",
  },
  "song-year": {
    title: "Song of the Year",
    description: "Vote for the song of the year",
  },
  collaboration: {
    title: "Best Collaboration",
    description: "Vote for the best collaboration of the year",
  },
  newcomer: {
    title: "Best Newcomer",
    description: "Vote for the best newcomer artist of the year",
  },
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Get category info or default to best-male
  const categoryInfo =
    categoryConfig[categoryId as keyof typeof categoryConfig] ||
    categoryConfig["best-male"];

  const displayTitle = categoryInfo?.title || "Category";
  const displayDescription =
    categoryInfo?.description || "Vote for your favorite";

  return (
    <>
      <PageMeta
        title={`${displayTitle} | Zimdancehall Music Awards`}
        description={displayDescription}
      />
      <PageBreadcrumb pageTitle={displayTitle} />
      <div className="space-y-6">
        <ComponentCard title={`${displayTitle} 2024 Voting`}>
          <CategoryVotingTable category={displayTitle} />
        </ComponentCard>
      </div>
    </>
  );
}
