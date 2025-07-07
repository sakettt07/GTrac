import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import vehiclesData from "../assets/vehicle.json";
import VehicleCard from "../components/VehicleCard";

const Content = ({ onShowRoute }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Running", "Idle", "Stopped", "POI", "Alert"];

  return (
    <div className="h-full w-full overflow-hidden flex gap-4 bg-white dark:bg-gray-900">
      {/* Left Panel */}
      <div
        className={`${
          selectedVehicle ? "w-2/3" : "w-full"
        } transition-all duration-300 overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1 rounded-full text-sm border ${
                activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 dark:bg-gray-700 dark:text-white"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="text-sm flex justify-between text-gray-600 dark:text-gray-300 mb-4">
          <p>Vehicles Count: {vehiclesData.vehicleCount}</p>
          <p>Updated at: {vehiclesData.updatedAt}</p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {vehiclesData.vehicles.map((vehicle, index) => (
            <VehicleCard
              key={index}
              vehicle={vehicle}
              onClick={setSelectedVehicle}
            />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      {selectedVehicle && (
        <div className="w-1/3 p-4 overflow-y-auto bg-white dark:bg-gray-800 relative border-l border-gray-200 dark:border-gray-700 transition-all duration-300">
          <button
            onClick={() => setSelectedVehicle(null)}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 dark:text-gray-300"
            title="Close"
          >
            <RxCross2 size={20} />
          </button>

          <div className="space-y-2 mt-6">
            <h3 className="text-lg font-semibold text-blue-700">
              {selectedVehicle.vehicleNumber}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Driver: {selectedVehicle.driver.name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Contact: {selectedVehicle.driver.contact}
            </p>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              📍 Location: {selectedVehicle.location.poi}
            </p>
            <p className="text-sm">Lat: {selectedVehicle.location.lat}</p>
            <p className="text-sm">Lng: {selectedVehicle.location.lng}</p>
            <p className="text-sm">
              Speed: {selectedVehicle.status.speed} km/h
            </p>
            <p className="text-sm">
              Ignition: {selectedVehicle.status.ignition ? "On" : "Off"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
