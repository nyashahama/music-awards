import { useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AwardsMetrics from "../../components/music-awards/AwardsMetrics";
import MonthlyVotesChart from "../../components/music-awards/MonthlyVotesChart";
import RecentVotes from "../../components/music-awards/RecentVotes";
import VoterDemographics from "../../components/music-awards/VoterDemographics";
import VotingStatistics from "../../components/music-awards/VotingStatistics";
import VotingTarget from "../../components/music-awards/VotingTarget";
import { useUsers } from "../../hooks/useUsers";
import { useVotes } from "../../hooks/useVotes";
import { useNominees } from "../../hooks/useNominees";

export default function Home() {
  const { users, getAllUsers } = useUsers();
  const { votes, getUserVotes, getAvailableVotes, getAllVotes } = useVotes();
  const { nominees, getAllNominees } = useNominees();

  useEffect(() => {
    // Fetch all required data on component mount
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllUsers(),
          getUserVotes(),
          getAvailableVotes(),
          getAllNominees(),
          getAllVotes(), // For admin stats
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate total voters (unique users who have voted)
  const totalVoters = users.users.length;

  // Calculate total votes cast
  const totalVotes = votes.votes.length;

  const isLoading = users.isLoading || votes.isLoading || nominees.isLoading;

  return (
    <>
      <PageMeta
        title="Zimdancehall Music Awards"
        description="Real-time voting dashboard and analytics for Zimdancehall Music Awards"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <AwardsMetrics
            totalVoters={totalVoters}
            totalVotes={totalVotes}
            isLoading={isLoading}
          />
          <MonthlyVotesChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <VotingTarget
            availableVotes={votes.availableVotes}
            totalVotes={totalVotes}
            isLoading={isLoading}
          />
        </div>
        <div className="col-span-12">
          <VotingStatistics />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <VoterDemographics users={users.users} isLoading={isLoading} />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <RecentVotes
            nominees={nominees.nominees}
            votes={votes.votes}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
