function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="w-60 bg-gray-800 border-r border-gray-700 shadow-lg flex flex-col pt-6">
      <button
        onClick={() => setActiveView("individual")}
        className={`px-6 py-3 my-2 text-left text-lg font-medium text-white ${
          activeView === "individual"
            ? "bg-gray-700"
            : "hover:bg-gray-700 hover:text-gray-300"
        }`}
      >
        Individual View
      </button>
      <button
        onClick={() => setActiveView("team")}
        className={`px-6 py-3 my-2 text-left text-lg font-medium text-white ${
          activeView === "team"
            ? "bg-gray-700"
            : "hover:bg-gray-700 hover:text-gray-300"
        }`}
      >
        Team View
      </button>
    </div>
  );
}

export default Sidebar;
