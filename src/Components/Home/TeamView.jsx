import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/api";

function TeamView({ userData }) {
  const [teams, setTeams] = useState([]);
  const [createTeamName, setCreateTeamName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
  if (userData.team !== '?') {
    fetch(`${API_BASE_URL}/api/auth/get-team-members/${userData.team}`)
      .then((res) => res.json())
      .then((data) => setTeamMembers(data))
      .catch((err) => console.error("Error fetching team members:", err));
  }
  }, [userData.team]);

  const isUserInTeam = () => {
    return userData.team !== "?";
  };

  const handleSearchTeam = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/search-teams`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, user_id: userData.id }),
      }
    );
    const result = await response.json();
    if (response.ok) setSearchResults(result);
    else alert(result.message);
  } catch (err) {
    console.error("Error searching teams:", err);
  }
};

   const handleJoinTeam = async (teamId) => {
    if (isUserInTeam()) {
      alert("You are already part of a team.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/join-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_id: teamId,
          user_id: userData.id,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Joined team!");
        setSearchResults([]);
        window.location.reload();
        // Optionally refresh userData from backend after join here
      } else alert(result.message);
    } catch (err) {
      console.error("Error joining team:", err);
    }
  };

  const handleLeaveTeam = async () => {
  if (!isUserInTeam()) {
    alert("You are not part of any team.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/leave-team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userData.id,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      alert("You have left the team.");
      // Clear teamMembers and optionally reload userData to reflect changes
      setTeamMembers([]);
      // or you might want to notify parent or trigger a page reload
      window.location.reload(); // simple way to reload updated user data
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error("Error leaving team:", err);
  }
};

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Team View</h1>

      {/* Show Create Team if user NOT in any valid team */}
      {!isUserInTeam() && (
        <div className="mb-8">
          <input
            type="text"
            placeholder="Create Team Name"
            value={createTeamName}
            onChange={(e) => setCreateTeamName(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 mr-2"
          />
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${API_BASE_URL}/api/auth/create-team`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    team_name: createTeamName,
                    user_id: userData.id,  // pass user_id here
                  }),
                });
                const result = await response.json();
                if (response.ok) {
                  alert("Team created!");
                  setCreateTeamName("");
                  // Optionally refresh teams here or notify parent
                } else alert(result.message);
              } catch (err) {
                console.error("Error creating team:", err);
              }
            }}
            className="py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Create Team
          </button>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Search Team by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={handleSearchTeam}
          className="py-2 px-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map((team) => (
              <div
                key={team.team_id}
                className="flex items-center justify-between border border-gray-600 rounded-lg p-4 text-gray-300"
              >
                <span>{team.team_name}</span>
                <button
                  onClick={() => handleJoinTeam(team.team_id)}
                  disabled={isUserInTeam()}
                  className={`py-2 px-4 rounded-xl transition ${
                    isUserInTeam()
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isUserInTeam() ? "Already in a Team" : "Join"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notice if user is in a valid team */}
      {isUserInTeam() && (
        <div className="mt-6 text-yellow-400 text-sm">
          You are already part of a team — leave your current team to join another.
        </div>
      )}

      {isUserInTeam() && (
  <div className="mt-10">
    <h2 className="text-xl font-semibold text-white mb-4">Your Team Members</h2>
    <table className="table-auto w-full text-left text-gray-300 border border-gray-700">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Role</th>
          <th className="px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {teamMembers.map((member, index) => (
          <tr key={index} className="border-t border-gray-700">
            <td className="px-4 py-2">{member.full_name}</td>
            <td className="px-4 py-2">{member.role}</td>
            <td className="px-4 py-2">{member.status}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Leave Team Button */}
    <div className="mt-6">
      <button
        className="py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        onClick={handleLeaveTeam}
      >
        Leave Team
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default TeamView;
