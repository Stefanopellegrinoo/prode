import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import UpcomingMatchesCard from "../components/dashboard/UpcomingMatchesCard";
import RecentResultsCard from "../components/dashboard/RecentResultsCard";
import UserStatsCard from "../components/dashboard/UserStatsCard";
import NotificationsCard from "../components/dashboard/NotificationsCard";
import { getUpcomingMatches, getRecentResults } from "../services/matchService";
import { getUserStats } from "../services/userService";
import { getNotifications } from "../services/notificationService";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { is } from "date-fns/locale";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch data in parallel
        const [matchesData, statsData] = await Promise.all([
          getUpcomingMatches(),
          // getRecentResults(),
          getUserStats(),
          // getNotifications()
        ]);

        setUpcomingMatches(matchesData);
        // setRecentResults(resultsData);
        setUserStats(statsData);
        // setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showToast("Error al cargar los datos del dashboard", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  const handleMatchClick = (matchId) => {
    navigate(`/match/${matchId}`);
  };

  return (
    <DashboardLayout title="Dashboard">
      <>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UpcomingMatchesCard
                matches={upcomingMatches || []}
                loading={loading}
                onMatchClick={handleMatchClick}
              />
            </div>
            <div>

            {!isAdmin && <UserStatsCard stats={userStats} loading={loading} />}
            </div>
            {/* <div>
          <RecentResultsCard 
            results={recentResults} 
            loading={loading} 
            onMatchClick={handleMatchClick}
          />
        </div>
         */}
            <div className="lg:col-span-2">
              <NotificationsCard
                notifications={notifications}
                loading={loading}
              />
            </div>
            <ToastContainer />
          </div>
        )}
      </>
    </DashboardLayout>
  );
};

export default Dashboard;
