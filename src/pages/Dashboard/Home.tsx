import PageMeta from "../../components/common/PageMeta";
import AwardsMetrics from "../../components/music-awards/AwardsMetrics";
import MonthlyVotesChart from "../../components/music-awards/MonthlyVotesChart";
import RecentVotes from "../../components/music-awards/RecentVotes";
import VoterDemographics from "../../components/music-awards/VoterDemographics";
import VotingStatistics from "../../components/music-awards/VotingStatistics";
import VotingTarget from "../../components/music-awards/VotingTarget";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Zimdancehall Music Awards"
        description="Real-time voting dashboard and analytics for Zimdancehall Music Awards"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <AwardsMetrics />
          <MonthlyVotesChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <VotingTarget />
        </div>
        <div className="col-span-12">
          <VotingStatistics />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <VoterDemographics />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <RecentVotes />
        </div>
      </div>
    </>
  );
}
