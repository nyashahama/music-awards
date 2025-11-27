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
import { useAuth } from "../../hooks";
import { UpdateProfileRequest, User } from "../../api/services";

export default function RegisteredVoters() {
  const { users, getAllUsers, updateProfile, promoteUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedVoter, setSelectedVoter] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

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

  // Fetch users on component mount
  useEffect(() => {
    getAllUsers();
  }, []);

  const locations = [...new Set(users.users.map((voter) => voter.location))];

  const filteredVoters = users.users.filter((voter) => {
    const matchesSearch =
      voter.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || voter.location === locationFilter;
    const matchesRole = roleFilter === "all" || voter.role === roleFilter;

    return matchesSearch && matchesLocation && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "warning" : "default";
  };

  const getVotesColor = (votes: number) => {
    if (votes === 0) return "error";
    if (votes <= 2) return "warning";
    return "success";
  };

  const getTotalVotes = (user: User) => {
    return user.free_votes + user.paid_votes;
  };

  const handleViewClick = (voter: User) => {
    setSelectedVoter(voter);
    openViewModal();
  };

  const handleEditClick = (voter: User) => {
    setEditFormData({ ...voter });
    openEditModal();
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;

    setIsUpdating(true);
    try {
      const updateData: UpdateProfileRequest = {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        location: editFormData.location,
      };

      await updateProfile(editFormData.user_id, updateData);
      closeEditModal();

      // Refresh the users list
      await getAllUsers();
    } catch (error) {
      console.error("Failed to update voter:", error);
      alert("Failed to update voter. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePromoteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to admin?")) {
      return;
    }

    setIsPromoting(true);
    try {
      await promoteUser(userId);
      alert("User promoted successfully!");

      // Refresh the users list
      await getAllUsers();
    } catch (error) {
      console.error("Failed to promote user:", error);
      alert("Failed to promote user. Please try again.");
    } finally {
      setIsPromoting(false);
    }
  };

  const handleExportData = () => {
    const csvContent = [
      [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Location",
        "Role",
        "Free Votes",
        "Paid Votes",
        "Total Votes",
        "Created At",
      ],
      ...filteredVoters.map((voter) => [
        voter.user_id,
        voter.first_name,
        voter.last_name,
        voter.email,
        voter.location,
        voter.role,
        voter.free_votes,
        voter.paid_votes,
        getTotalVotes(voter),
        voter.created_at,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registered-voters-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageMeta
        title="Registered Voters | Zimdancehall Music Awards"
        description="Manage registered voters and their voting status"
      />
      <PageBreadcrumb pageTitle="Registered Voters" />

      <div className="space-y-6">
        <ComponentCard title="Voters Management">
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
              <div className="text-2xl font-bold">{users.users.length}</div>
              <div className="text-sm opacity-90">Total Voters</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {users.users.filter((v) => getTotalVotes(v) > 0).length}
              </div>
              <div className="text-sm opacity-90">Active Voters</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {users.users.filter((v) => v.role === "admin").length}
              </div>
              <div className="text-sm opacity-90">Admin Users</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {users.users.reduce((sum, v) => sum + getTotalVotes(v), 0)}
              </div>
              <div className="text-sm opacity-90">Total Available Votes</div>
            </div>
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {users.isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading voters...
              </p>
            </div>
          ) : (
            <>
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
                          Voter
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Location
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Role
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Available Votes
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Registered
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
                      {filteredVoters.map((voter) => (
                        <TableRow
                          key={voter.user_id}
                          className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                        >
                          <TableCell className="px-5 py-4 text-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {voter.first_name.charAt(0)}
                                {voter.last_name.charAt(0)}
                              </div>
                              <div>
                                <span className="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                  {voter.first_name} {voter.last_name}
                                </span>
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                  ID: {voter.user_id}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {voter.email}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {voter.location}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <Badge size="sm" color={getRoleColor(voter.role)}>
                              {voter.role.charAt(0).toUpperCase() +
                                voter.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <Badge
                              size="sm"
                              color={getVotesColor(getTotalVotes(voter))}
                            >
                              {getTotalVotes(voter)} votes
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                              Free: {voter.free_votes} | Paid:{" "}
                              {voter.paid_votes}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {formatDate(voter.created_at)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleViewClick(voter)}
                                className="px-3 py-1 text-xs font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleEditClick(voter)}
                                className="px-3 py-1 text-xs font-medium text-green-600 transition-colors bg-green-100 rounded-lg hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                              >
                                Edit
                              </button>
                              {voter.role === "user" && (
                                <button
                                  onClick={() =>
                                    handlePromoteUser(voter.user_id)
                                  }
                                  disabled={isPromoting}
                                  className="px-3 py-1 text-xs font-medium text-purple-600 transition-colors bg-purple-100 rounded-lg hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200"
                                >
                                  Promote
                                </button>
                              )}
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
                      Showing {filteredVoters.length} of {users.users.length}{" "}
                      voters
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
            </>
          )}
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
              Voter Details
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              View detailed information about this voter.
            </p>
          </div>

          {selectedVoter && (
            <div className="px-2">
              <div className="mb-6 flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                  {selectedVoter.first_name.charAt(0)}
                  {selectedVoter.last_name.charAt(0)}
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    {selectedVoter.first_name} {selectedVoter.last_name}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {selectedVoter.user_id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {selectedVoter.email}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {selectedVoter.location}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <Badge size="sm" color={getRoleColor(selectedVoter.role)}>
                    {selectedVoter.role.charAt(0).toUpperCase() +
                      selectedVoter.role.slice(1)}
                  </Badge>
                </div>

                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Available Votes
                  </p>
                  <Badge
                    size="sm"
                    color={getVotesColor(getTotalVotes(selectedVoter))}
                  >
                    {getTotalVotes(selectedVoter)} votes
                  </Badge>
                </div>

                <div className="col-span-2">
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(selectedVoter.created_at)}
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
                    handleEditClick(selectedVoter);
                  }}
                >
                  {isUpdating ? "Edit..." : "Edit"}
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
              Edit Voter Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update voter details and preferences.
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
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      type="text"
                      value={editFormData.first_name}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      type="text"
                      value={editFormData.last_name}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Email Address</Label>
                    <Input
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Location</Label>
                    <Input
                      name="location"
                      type="text"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Available Votes</Label>
                    <Input
                      name="availableVotes"
                      type="number"
                      value={getTotalVotes(editFormData)}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                availableVotes: parseInt(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Role</Label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={(e) =>
                        setEditFormData((prev) =>
                          prev ? { ...prev, role: e.target.value } : null
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="voter">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <Label>User ID</Label>
                    <Input
                      type="text"
                      value={editFormData.user_id}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Member Since</Label>
                    <Input
                      type="text"
                      value={formatDate(editFormData.created_at)}
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
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
