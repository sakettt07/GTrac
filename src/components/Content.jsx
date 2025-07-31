import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import VehicleCard from "../components/VehicleCard";
import { TbReportAnalytics } from "react-icons/tb";
import { SiGooglenearby } from "react-icons/si";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { FiSearch } from "react-icons/fi";
import { FaCircle } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { GiAutoRepair } from "react-icons/gi";
import { PiChargingStationDuotone } from "react-icons/pi";
import LogCard from "./LogCard";
import { useVehicle } from "../context/VehicleContext";
import noVehicle from "../assets/noVehicle.png";
import { MdOutlineFileDownload } from "react-icons/md";

const Content = ({ selectedVehicleNumbers = [] }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [activeTab, setActiveTab] = useState("All");
  const [nearbyMenuActive, setNearByMenuActive] = useState(false);
  const loaderRef = useRef(null);

  const {
    vehicles,
    logs,
    loading,
    error,
    selectedVehicle,
    activeFilter,
    timeFilter,
    lastUpdated,
    isRefreshing,
    fetchVehiclesByFilter,
    refreshVehicles,
    setSelectedVehicle,
    setTimeFilter,
    clearError,
    getFilteredVehicles,
  } = useVehicle();
  

  const filters = ["All", "Running", "Idle", "Stopped", "POI", "Alert"];
  const [pathStats, setPathStats] = useState({
    runningTime: "-",
    totalDistance: "-",
    stoppageTime: "-",
    fromTime: "-",
    toTime: "-",

  });

  const filteredVehicles = selectedVehicleNumbers.length
    ? vehicles.filter((v) => selectedVehicleNumbers.includes(v.vehicleNumber))
    : getFilteredVehicles();

  // ---------------- Path API State ----------------
  const [vehicleLogsByMode, setVehicleLogsByMode] = useState({
    All: [],
    Movement: [],
    Stoppages: [],
    Alerts: [],
  });
  const [pathLoading, setPathLoading] = useState(false);
  const [pathError, setPathError] = useState(null);

  // ---------------- Date Helper Functions ----------------
  const getDateRange = (filter) => {
    const now = new Date();
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    switch (filter) {
      case "today":
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        return {
          startdate: formatDate(todayStart),
          enddate: formatDate(now)
        };

      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStart = new Date(yesterday);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return {
          startdate: formatDate(yesterdayStart),
          enddate: formatDate(yesterdayEnd)
        };

      case "24hrs":
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return {
          startdate: formatDate(twentyFourHoursAgo),
          enddate: formatDate(now)
        };

      case "lastweek":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        weekAgo.setHours(0, 0, 0, 0);
        return {
          startdate: formatDate(weekAgo),
          enddate: formatDate(now)
        };

      case "lastmonth":
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        return {
          startdate: formatDate(monthAgo),
          enddate: formatDate(now)
        };

      default:
        // Default to today
        const defaultStart = new Date(now);
        defaultStart.setHours(0, 0, 0, 0);
        return {
          startdate: formatDate(defaultStart),
          enddate: formatDate(now)
        };
    }
  };

  // ---------------- Intersection Observer ----------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + 8);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  // ---------------- Fetch Logs from New API ----------------
  useEffect(() => {
    const fetchVehiclePathData = async () => {
      if (!selectedVehicle) return;

      setPathLoading(true);
      setPathError(null);
      
      try {
        const { id } = selectedVehicle;
        const { startdate, enddate } = getDateRange(timeFilter);

        console.log(`Fetching data for ${timeFilter}:`, { startdate, enddate });

        const res = await fetch(
          `https://gtrac.in:8089/trackingDashboard/getpathwithDateDaignostic?vId=${id}&startdate=${startdate}&enddate=${enddate}&requestfor=0&userid=82885`
        );

        const json = await res.json();
        if (!json || !json.data) throw new Error("No data received");

        const movement = json.data.filter((d) => d.mode === "Running");
        const stoppages = json.data.filter((d) => d.mode === "Idle");
        const alerts = json.data.filter((d) => d.mode === "Alert");

        setVehicleLogsByMode({
          All: json.data,
          Movement: movement,
          Stoppages: stoppages,
          Alerts: alerts,
        });

        // ✅ Extract top-level stats if present
        setPathStats({
          runningTime: json.runningTime || "-",
          totalDistance: json.totalDistance || "-",
          stoppageTime: json.stoppageTime || "-",
          fromTime:json.fromTime || "-",
          toTime:json.toTime || "-",
        });

        console.log("✅ Full response from path API:", json);
      } catch (err) {
        console.error("Error fetching path data:", err);
        setPathError(err.message || "Error fetching path data");
      } finally {
        setPathLoading(false);
      }
    };

    fetchVehiclePathData();
  }, [selectedVehicle, timeFilter]); // Added timeFilter as dependency

  const toggleNearByMenu = () => setNearByMenuActive((prev) => !prev);
  const handleFilterChange = (filter) => fetchVehiclesByFilter(filter);
  const handleRefresh = () => refreshVehicles();
  const handleRetry = () => {
    clearError();
    fetchVehiclesByFilter(activeFilter);
  };

  // Handle time filter change
  const handleTimeFilterChange = (newTimeFilter) => {
    setTimeFilter(newTimeFilter);
    // Reset active tab when changing time filter
    setActiveTab("All");
  };

  const filteredLogs = vehicleLogsByMode[activeTab] || [];

  // ---------------- Loading State ----------------
  if (loading && !isRefreshing) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  // ---------------- Error State ----------------
  if (error && !isRefreshing) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-500 mb-4">Error loading vehicles: {error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  function formatLocationString(raw) {
    if (!raw) return "Unknown Location";

    let clean = raw.replace(/^undefined\s*/i, "").trim();
    clean = clean.split("##")[0];
    clean = clean.replace(/_/g, " ");
    clean = clean
      .split(" ")
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
      )
      .join(" ");

    return clean.trim() || "Unknown Location";
  }
  console.log("THis is the path stats data",pathStats);

  return (
    <div className="h-full w-full overflow-hidden flex gap-4 bg-white">
      {/* Left Panel */}
      <div
        className={`${
          selectedVehicle ? "w-2/3" : "w-full"
        } transition-all duration-300 overflow-y-auto p-4`}
      >
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max w-full">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full text-sm border cursor-pointer whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-green-600 text-white border border-green-600"
                    : "bg-white text-gray-700 dark:text-black"
                }`}
                onClick={() => handleFilterChange(filter)}
                disabled={loading}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm flex justify-between text-gray-700 mb-4">
          <p>Vehicles Count: {filteredVehicles.length}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50"
            >
              {isRefreshing ? "🔄 Refreshing..." : "🔄"}
            </button>
            {lastUpdated && (
              <p>Updated at: {new Date(lastUpdated).toLocaleString()}</p>
            )}
            <MdOutlineFileDownload className="text-[16px]" />
          </div>
        </div>

        {isRefreshing && (
          <div className="mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-blue-400 text-sm">
              Refreshing data...
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filteredVehicles.slice(0, visibleCount).map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id || index}
              vehicle={vehicle}
              onClick={(vehicle) => {
                setSelectedVehicle(vehicle);
              }}
              isSelected={selectedVehicle?.id === vehicle.id}
            />
          ))}
          <div
            ref={loaderRef}
            className="h-10 flex items-center justify-center"
          >
            {visibleCount < filteredVehicles.length ? (
              <p className="text-sm text-gray-400">Loading more...</p>
            ) : (
              <p className="text-sm text-gray-400">
                {filteredVehicles.length === 0
                  ? <div className="flex flex-col items-center gap-4">
                    <img className="w-36 mt-60" src={noVehicle} alt="" />
                    <h4>Nothing found</h4>
                  </div>
                  : "No more vehicles"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selectedVehicle && (
        <div className="w-[40%] p-4 overflow-y-auto bg-white relative border-l border-gray-200">
          <button
            onClick={() => setSelectedVehicle(null)}
            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
            title="Close"
          >
            <RxCross2 size={20} />
          </button>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={selectedVehicle.vehicleNumber}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <button
                title="Expand Reports"
                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-md"
              >
                <TbReportAnalytics className="text-blue-600" size={20} />
              </button>
              <button
                title="Nearby"
                className="p-2 bg-green-100 hover:bg-green-200 rounded-md"
              >
                <SiGooglenearby
                  onClick={toggleNearByMenu}
                  className="text-green-600"
                  size={20}
                />
              </button>
              <button
                title="Download Report"
                className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-md"
              >
                <LiaFileDownloadSolid className="text-yellow-600" size={20} />
              </button>
            </div>

            {nearbyMenuActive && (
              <div className="absolute top-20 right-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Nearby Options
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-200 transition">
                    <BsFillFuelPumpFill className="text-blue-600" size={16} />
                    <span className="text-black">Petrol Pump</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-200 transition">
                    <GiAutoRepair className="text-green-600" size={16} />
                    <span className="text-black">Mechanic</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-200 transition">
                    <PiChargingStationDuotone
                      className="text-cyan-700"
                      size={16}
                    />
                    <span className="text-black">EV Station</span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <select
                value={timeFilter}
                onChange={(e) => handleTimeFilterChange(e.target.value)}
                className="border border-gray-300 rounded-md p-3 text-sm text-black w-full"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="24hrs">Last 24 Hours</option>
                <option value="lastweek">Last Week</option>
                <option value="lastmonth">Last Month</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-gray-500 text-sm">
              <p>{pathStats.fromTime || "N/A"}</p>
              <p>-</p>
              <p>{pathStats.toTime || "N/A"}</p>
            </div>

            <div className="flex items-center justify-between mt-4 border border-gray-400 h-20 px-2 rounded-md text-black">
              <div className="flex flex-col items-center pl-3">
                <h1 className="text-[12px]">Running Time</h1>
                <p className="font-semibold text-sm">
                  {pathStats.runningTime || 0} 
                </p>
              </div>
              <div className="flex flex-col items-center border border-gray-400 h-20 py-5 px-2">
                <h1 className="text-[12px]">Total Distance</h1>
                <p className="font-semibold text-sm">
                  {pathStats.totalDistance || 0}
                </p>
              </div>
              <div className="flex flex-col items-center pr-3">
                <h1 className="text-[12px]">Stopped Time</h1>
                <p className="font-semibold text-sm">
                  {pathStats.stoppageTime || 0}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-md p-3 mt-4 text-wrap">
              <p className="text-sm text-black flex items-center gap-4">
                <span className="relative w-3 h-3">
                  <FaCircle className="text-[#52ae8f] text-[7px] absolute inset-0 wave-ping" />
                  <FaCircle className="text-[#52ae8f] text-[7px] relative z-10" />
                </span>
                <p className="text-black text-wrap w-56">
                  {formatLocationString(selectedVehicle.location) || "Unknown Location"}
                </p>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Updated at:{" "}
                {selectedVehicle.raw?.gpsDtl?.latLngDtl?.gpstime || "Unknown"}
              </p>
              {selectedVehicle.poi &&
                selectedVehicle.poi !== "No Nearest POI" && (
                  <p className="text-xs text-blue-600 mt-1">
                    POI: {selectedVehicle.poi}
                  </p>
                )}
            </div>

            <div className="flex gap-4 mt-4 text-sm border-b border-gray-300 text-gray-600">
              {["All", "Movement", "Stoppages", "Alerts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition-all duration-200 ${
                    activeTab === tab
                      ? "border-b-2 border-black font-medium text-black"
                      : "hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-4">
              {pathLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-blue-500">Loading {timeFilter} data...</span>
                </div>
              ) : pathError ? (
                <p className="text-sm text-red-500">Error: {pathError}</p>
              ) : filteredLogs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {activeTab === "Movement"
                    ? `No movements found for ${timeFilter}`
                    : activeTab === "Stoppages"
                    ? `No stoppages found for ${timeFilter}`
                    : activeTab === "Alerts"
                    ? `No alerts found for ${timeFilter}`
                    : `No logs found for ${timeFilter}.`}
                </p>
              ) : (
                filteredLogs.map((log, index) => (
                  <LogCard selectedVehicle={selectedVehicle} key={index} log={log} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;