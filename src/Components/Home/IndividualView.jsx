import { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../api/api";
import { parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./Styles/calendarCustom.css";

const localizer = momentLocalizer(moment);

function IndividualView() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    status: "Available",
    description: ""
  });

  const fetchStatusEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/user-statuses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (response.ok) {
      const mappedEvents = result.map(item => {
        let start = new Date(item.start_date);
        if (item.start_time) {
          const [hours, minutes, seconds] = item.start_time.split(":");
          start.setHours(hours, minutes, seconds || 0);
        }

        let end = new Date(item.end_date);
        if (item.end_time) {
          const [hours, minutes, seconds] = item.end_time.split(":");
          end.setHours(hours, minutes, seconds || 0);
        }

        return {
          id: item.id,
          title: item.status,
          start: start,
          end: end,
          status: item.status
        };
      });

      setEvents(mappedEvents);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error fetching status events:", error);
  }
};

useEffect(() => {
  if (token) fetchStatusEvents();
}, [token]);


  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";

    if (event.status === "Available") backgroundColor = "green";
    else if (event.status === "Busy") backgroundColor = "red";
    else if (event.status === "On Leave") backgroundColor = "orange";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "white",
        border: "none"
      }
    };
  };

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value
  }));
};

  const handleSaveAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/add-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Needed here since your backend requires it for /add-status
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
      alert("Availability saved");
      fetchStatusEvents();

      // Check if now falls in the newly added status period
      const now = new Date();
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || "00:00"}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || "23:59"}`);

      if (now >= startDateTime && now <= endDateTime) {
        // update live status via /update-status using userData.email
        await fetch(`${API_BASE_URL}/api/auth/update-status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userData.email,
            status: formData.status
          })
        });
      }

      // Reset form
      setFormData({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        status: "Available",
        description: ""
      });

    } else {
      alert(result.message || "Error saving status");
    }
  } catch (error) {
    console.error("Error saving availability:", error);
  }
};


  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-4">Your Calendar</h1>

      <div className="bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          style={{ height: 600, backgroundColor: "#1f2937", color: "white" }}
        />
      </div>

      <h2 className="text-xl font-semibold text-white mb-3">Set Custom Availability</h2>

      <div className="bg-gray-800 rounded-2xl shadow p-6 space-y-4">
        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Start Time */}
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* End Time */}
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Status Select */}
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Available</option>
          <option>Busy</option>
          <option>On Leave</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description..."
          className="w-full border rounded-xl px-4 py-2 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Save Button */}
        <button
          onClick={handleSaveAvailability}
          className="py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}

export default IndividualView;
