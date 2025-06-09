import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setToken(result.token);
        console.log(result.token);
        navigate("/");
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <nav className="bg-gray-800 shadow-md py-4 px-6 fixed w-full top-0 left-0 flex items-center justify-start">
        <h2 className="text-3xl font-semibold text-white">Team Tracker</h2>
      </nav>

      <div className="flex flex-1 items-center justify-center pt-16 px-10">
        <div className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input type="email" name="email" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input type="password" name="password" required className="w-full px-4 py-2 rounded-xl border bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Login</button>

            <p className="text-sm text-gray-400 text-center mt-4">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline font-medium">Register here</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
