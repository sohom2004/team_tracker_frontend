import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import IndividualView from "./IndividualView";
import TeamView from "./TeamView";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../api/api";

function Home() {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Available");
  const [activeView, setActiveView] = useState("individual");
  const [liveStatus, setLiveStatus] = useState("Available");

  const fetchLiveStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/live-status/${userData.email}`);
      const result = await response.json();
      if (response.ok) {
        setLiveStatus(result.status);
      }
    } catch (error) {
      console.error("Error fetching live status:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        setUserData(result);
        setStatus(result.status);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userData.email,
          status: newStatus
        })
      });

      if (response.ok) {
        fetchUserData();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
  if (userData?.email) {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/live-status/${userData.email}`);
        const result = await response.json();
        if (response.ok) {
          if (result.status !== userData.status) {
            setUserData((prev) => ({ ...prev, status: result.status }));
            setStatus(result.status);
            console.log("Updated userData.status via live status check:", result.status); // ✅ Log here
          }
        }
      } catch (err) {
        console.error("Error refreshing live status:", err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }
}, [userData?.email, userData?.status]);


  // ✅ Add loading guard here
  if (loading) {
    return <div className="text-white p-4">Loading user data...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      <Navbar userData={userData} onStatusChange={handleStatusChange} />

      <div className="flex flex-1 pt-16">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <div className="flex-1">
          {activeView === "individual" ? (
            <IndividualView userData={userData} />
          ) : (
            <TeamView userData={userData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;