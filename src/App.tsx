import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./hooks/useUsers";
import CategoryPage from "./pages/Tables/CategoryPage";
import AllNominees from "./components/tables/AllNominees";
import AddNominee from "./pages/Forms/AddNominee";
import RegisteredVoters from "./components/tables/RegisteredVoters";
import VotingActivity from "./components/tables/VotingActivity";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            {/* <Route path="/add-nominee" element={<FormElements />} /> */}
            <Route path="/voters" element={<RegisteredVoters />} />
            <Route path="/voter-activity" element={<VotingActivity />} />

            {/* Tables */}
            <Route path="/basic-table" element={<BasicTables />} />
            {/* Category Pages */}
            <Route path="/best-male" element={<CategoryPage />} />
            <Route path="/best-female" element={<CategoryPage />} />
            <Route path="/song-year" element={<CategoryPage />} />
            <Route path="/collaboration" element={<CategoryPage />} />
            <Route path="/newcomer" element={<CategoryPage />} />

            {/* Nominees Management */}
            <Route path="/nominees" element={<AllNominees />} />
            <Route path="/add-nominee" element={<AddNominee />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout - Now wrapped in AuthProvider */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
