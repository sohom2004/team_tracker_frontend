import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Register({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      full_name: formData.get("full_name"),
      role: formData.get("role"),
      time_zone: formData.get("time_zone"),
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token);
        navigate("/");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <nav className="bg-gray-800 shadow-md py-4 px-6 fixed w-full top-0 left-0 flex items-center justify-start">
        <h2 className="text-3xl font-semibold text-white">Team Tracker</h2>
      </nav>

      <div className="flex flex-1 items-center justify-center pt-16 px-10">
        <div className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
              <input type="text" name="full_name" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Role</label>
              <select name="role" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a role</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="qa">QA</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Time Zone</label>
              <select name="time_zone" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select time zone</option>
                <option value="IST">IST (GMT+5:30)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="EST">EST (GMT-5)</option>
                <option value="PST">PST (GMT-8)</option>
                <option value="CET">CET (GMT+1)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input type="email" name="email" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input type="password" name="password" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Register</button>

            <p className="text-sm text-gray-400 text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline font-medium">Login here</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
