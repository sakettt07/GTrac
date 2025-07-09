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

const Content = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [timeFilter, setTimeFilter] = useState("today");
  const loaderRef = useRef(null);
  const [activeTab, setActiveTab] = useState("All");
  const [nearbyMenuActive, setNearByMenuActive] = useState(false);
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = ["All", "Running", "Idle", "Stopped", "POI", "Alert"];

  // API configuration
  const API_CONFIG = {
    baseUrl: "https://gtrac.in:8089/trackingDashboard/getListVehiclesmob",
    token: "55042",
    userid: "82885",
    puserid: "1"
  };

  // Function to fetch vehicles from API
  const fetchVehicles = async (mode = "STOPPED") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        token: API_CONFIG.token,
        userid: API_CONFIG.userid,
        puserid: API_CONFIG.puserid,
        mode: mode
      });

      const response = await fetch(`${API_CONFIG.baseUrl}?${params}`);
      console.log(response.url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data)
      
      // Transform API data to match your component's expected format
      const transformedVehicles = data.list.map(vehicle => ({
        id: vehicle.vId,
        vehicleNumber: vehicle.vehReg,
        driver: vehicle.drivers?.driverName || "N/A",
        phone: vehicle.drivers?.phoneNumber || "N/A",
        status: vehicle.gpsDtl?.mode || "Unknown",
        location: vehicle.gpsDtl?.latLngDtl?.addr || "Unknown Location",
        poi: vehicle.gpsDtl?.latLngDtl?.poi || "No POI",
        speed: vehicle.gpsDtl?.speed || 0,
        fuel: vehicle.gpsDtl?.fuel || 0,
        lastUpdate: vehicle.gpsDtl?.latLngDtl?.gmstime || "Unknown",
        modeTime: vehicle.gpsDtl?.modeTime || "0 min",
        ignition: vehicle.gpsDtl?.ignState || "Off",
        battery: vehicle.gpsDtl?.percentageBttry || "0%",
        lat: vehicle.gpsDtl?.latLngDtl?.lat || 0,
        lng: vehicle.gpsDtl?.latLngDtl?.lng || 0,
        yesterdayKM: vehicle.gpsDtl?.Yesterday_KM || 0,
        odometer: vehicle.gpsDtl?.tel_odometer || 0,
        alertCount: vehicle.gpsDtl?.alertCount || 0,
        vehicleState: vehicle.vehicleState || "Unknown",
        haltedSince: vehicle.gpsDtl?.hatledSince || "Unknown",
        angle: vehicle.gpsDtl?.angle || 0,
        temperature: vehicle.gpsDtl?.temperature || null,
        voltage: vehicle.gpsDtl?.volt || null,
        raw: vehicle // Keep original data for detailed view
      }));

      setVehicles(transformedVehicles);
      
      // Generate some sample logs based on vehicle data
      const sampleLogs = transformedVehicles.map((vehicle, index) => ({
      id: index + 1,
      type: index % 3 === 0 ? "Alert" : index % 3 === 1 ? "Stoppages" : "Movement",
      time: vehicle.lastUpdate,
      message: `${vehicle.vehicleNumber} - ${vehicle.status}`,
      location: vehicle.location,
      details: `Speed: ${vehicle.speed} km/h, Fuel: ${vehicle.fuel}%`
    }));
      
      setLogs(sampleLogs);
      
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Fetch vehicles when filter changes
  useEffect(() => {
    const modeMap = {
      "All": "ALL",
      "Running": "RUNNING",
      "Idle": "IDLE", 
      "Stopped": "STOPPED",
      "POI": "POI",
      "Alert": "ALERT"
    };
    
    fetchVehicles(modeMap[activeFilter] || "ALL");
  }, [activeFilter]);

  // Intersection Observer for infinite scrolling
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

  const toggleNearByMenu = () => {
    setNearByMenuActive((prev) => !prev);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (activeFilter === "All") return true;
    return vehicle.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  const filteredLogs = activeTab === "All" 
    ? logs 
    : logs.filter((log) => log.type.toLowerCase() === activeTab.toLowerCase());

  // Loading state
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 mb-4">Error loading vehicles: {error}</p>
          <button 
            onClick={() => fetchVehicles()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden flex gap-4 bg-black">
      {/* Left Panel */}
      <div
        className={`${
          selectedVehicle ? "w-2/3" : "w-full"
        } transition-all duration-300 overflow-y-auto p-4`}
      >
        {/* Filter Buttons */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max w-full">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full text-sm border whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 dark:text-black"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Count */}
        <div className="text-sm flex justify-between text-gray-200 mb-4">
          <p>Vehicles Count: {filteredVehicles.length}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchVehicles()}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              🔄 Refresh
            </button>
            <p>Updated at: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="flex flex-col gap-3">
          {filteredVehicles.slice(0, visibleCount).map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id || index}
              vehicle={vehicle}
              onClick={setSelectedVehicle}
            />
          ))}

          {/* Loader Trigger */}
          <div
            ref={loaderRef}
            className="h-10 flex items-center justify-center"
          >
            {visibleCount < filteredVehicles.length ? (
              <p className="text-sm text-gray-400">Loading more...</p>
            ) : (
              <p className="text-sm text-gray-400">
                {filteredVehicles.length === 0 ? "No vehicles found" : "No more vehicles"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selectedVehicle && (
        <div className="w-[40%] p-4 overflow-y-auto bg-white relative border-l border-gray-200">
          {/* Close Button */}
          <button
            onClick={() => setSelectedVehicle(null)}
            className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
            title="Close"
          >
            <RxCross2 size={20} />
          </button>

          <div className="mt-6 space-y-4">
            {/* Search Bar with Icons */}
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

              {/* Icon Buttons */}
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

            {/* Nearby Menu */}
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
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:remove-200 transition">
                    <PiChargingStationDuotone className="text-cyan-700" size={16} />
                    <span className="text-black">EV Station</span>
                  </button>
                </div>
              </div>
            )}

            {/* Time Filter Dropdown */}
            <div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-3 text-sm text-black w-full"
              >
                <option value="today">Today</option>
                <option value="24hrs">Last 24 Hours</option>
                <option value="lastweek">Last Week</option>
                <option value="lastmonth">Last Month</option>
              </select>
            </div>

            {/* Time Range Display */}
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <p>{selectedVehicle.lastUpdate || "N/A"}</p>
              <p>-</p>
              <p>{selectedVehicle.haltedSince || "N/A"}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-4 border border-gray-400 h-20 px-2 rounded-md text-black">
              <div className="flex flex-col items-center pl-3">
                <h1 className="text-[12px]">Speed</h1>
                <p className="font-semibold text-sm">{selectedVehicle.speed || 0} km/h</p>
              </div>
              <div className="flex flex-col items-center border border-gray-400 h-20 py-5 px-2">
                <h1 className="text-[12px]">Yesterday KM</h1>
                <p className="font-semibold text-sm">{selectedVehicle.yesterdayKM || 0} km</p>
              </div>
              <div className="flex flex-col items-center pr-3">
                <h1 className="text-[12px]">Fuel</h1>
                <p className="font-semibold text-sm">{selectedVehicle.fuel || 0}%</p>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-100 border border-gray-300 rounded-md p-3 mt-4">
              <p className="text-sm text-black flex items-center gap-4">
                <strong>
                  <FaCircle className="text-blue-600 text-[10px]" />
                </strong>
                {selectedVehicle.location || "Unknown Location"}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Updated at: {selectedVehicle.lastUpdate || "Unknown"}
              </p>
              {selectedVehicle.poi && selectedVehicle.poi !== "No Nearest POI" && (
                <p className="text-xs text-blue-600 mt-1">
                  POI: {selectedVehicle.poi}
                </p>
              )}
            </div>

            {/* Additional Vehicle Details */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-3 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong className="text-gray-700">Driver:</strong>
                  <p className="text-black">{selectedVehicle.driver || "N/A"}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Phone:</strong>
                  <p className="text-black">{selectedVehicle.phone || "N/A"}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Status:</strong>
                  <p className="text-black">{selectedVehicle.status || "Unknown"}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Ignition:</strong>
                  <p className="text-black">{selectedVehicle.ignition || "Off"}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Battery:</strong>
                  <p className="text-black">{selectedVehicle.battery || "0%"}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Odometer:</strong>
                  <p className="text-black">{selectedVehicle.odometer || 0} km</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
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

            {/* Logs Content */}
            <div className="mt-4 grid gap-4">
              {filteredLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No logs found.</p>
              ) : (
                filteredLogs.map((log, index) => <LogCard key={index} log={log} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;