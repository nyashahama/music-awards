// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./hooks/useUsers";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";

// Auth Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";

// Dashboard Pages
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";

// Category & Nominee Management
import CategoryPage from "./pages/Tables/CategoryPage";
import CategoriesManagement from "./components/tables/CategoriesManagement";
import CategoriesListPage from "./pages/Tables/CategoriesListPage";
import EditCategory from "./components/tables/EditCategory";
import AddCategory from "./pages/Forms/AddCategory";
import AllNominees from "./components/tables/AllNominees";
import AddNominee from "./pages/Forms/AddNominee";

// Voting Management
import RegisteredVoters from "./components/tables/RegisteredVoters";
import VotingActivity from "./components/tables/VotingActivity";
import LiveResults from "./components/tables/LiveResults";
import VotingAnalyticsReports from "./components/tables/VotingAnalyticsReports";

// UI Elements
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";

// Charts
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

// Tables
import BasicTables from "./pages/Tables/BasicTables";

// Other
import NotFound from "./pages/OtherPage/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoutes";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />

            {/* User & Profile */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Category Management */}
            <Route
              path="/categories/manage"
              element={<CategoriesManagement />}
            />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route
              path="/categories/edit/:categoryId"
              element={<EditCategory />}
            />
            <Route path="/categories" element={<CategoriesListPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* Nominee Management */}
            <Route path="/nominees" element={<AllNominees />} />
            <Route path="/add-nominee" element={<AddNominee />} />

            {/* Voting Management */}
            <Route path="/voters" element={<RegisteredVoters />} />
            <Route path="/voter-activity" element={<VotingActivity />} />
            <Route path="/live-results" element={<LiveResults />} />
            <Route path="/analytics" element={<VotingAnalyticsReports />} />

            {/* Calendar */}
            <Route path="/calendar" element={<Calendar />} />

            {/* UI Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Tables */}
            <Route path="/basic-table" element={<BasicTables />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
