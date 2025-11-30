import { useState, useMemo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import CountryMap from "./CountryMap";
import { User } from "../../api/services/userService";

interface VoterDemographicsProps {
  users?: User[];
  isLoading?: boolean;
}

export default function VoterDemographics({
  users = [],
  isLoading = false,
}: VoterDemographicsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Process user locations to get demographics
  const countryData = useMemo(() => {
    if (users.length === 0) {
      // Fallback to mock data
      return [
        { country: "Zimbabwe", voters: 2847, percentage: 85 },
        { country: "South Africa", voters: 412, percentage: 12 },
        { country: "United Kingdom", voters: 98, percentage: 3 },
      ];
    }

    const countryCounts = users.reduce(
      (acc, user) => {
        const country = user.location || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const total = users.length;

    return Object.entries(countryCounts)
      .map(([country, voters]) => ({
        country,
        voters,
        percentage: Math.round((voters / total) * 100),
      }))
      .sort((a, b) => b.voters - a.voters)
      .slice(0, 3);
  }, [users]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 animate-pulse">
        <div className="flex justify-between mb-6">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-40"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-48"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
        <div className="h-48 bg-gray-200 rounded dark:bg-gray-700 mb-6"></div>
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="w-32 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Voter Demographics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of voters based on country
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export Data
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        {countryData.map((country, index) => (
          <div
            key={country.country}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="items-center w-full rounded-full max-w-8">
                <img
                  src={`./images/country/country-0${index + 1}.svg`}
                  alt={country.country.toLowerCase()}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {country.country}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {country.voters.toLocaleString()} Voters
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                  style={{ width: `${country.percentage}%` }}
                ></div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {country.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
