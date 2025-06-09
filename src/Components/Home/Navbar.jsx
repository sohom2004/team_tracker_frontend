import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navbar({ userData, onStatusChange }) {
  const { logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userFullName = userData.full_name || "User";

  const handleDropdownChange = (e) => {
    onStatusChange(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 shadow-md py-4 px-6 fixed w-full top-0 left-0 flex items-center justify-between z-10">
      <h2 className="text-3xl font-semibold text-white">Team Tracker</h2>

      <div className="flex items-center space-x-6">
        {/* Status Dropdown */}
        <select
          value={userData.status}
          onChange={handleDropdownChange}
          className="border rounded-xl px-3 py-1 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Available</option>
          <option>Busy</option>
          <option>On Leave</option>
        </select>

        {/* User Dropdown */}
        <div ref={dropdownRef} className="relative cursor-pointer">
          <button
            onClick={toggleDropdown}
            className="text-white font-medium focus:outline-none"
          >
            {userFullName}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-700 border border-gray-600 rounded shadow-lg z-50">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
