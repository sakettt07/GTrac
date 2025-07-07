import React from "react";

const VehicleCard = ({ vehicle, onClick }) => {
  return (
    <div
      className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
      onClick={() => onClick(vehicle)}
    >
      <p className="text-blue-700 font-semibold">{vehicle.vehicleNumber}</p>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
        Last data received at {vehicle.lastUpdated}
      </p>
      <p className="text-sm text-gray-800 dark:text-gray-200">
        📍 {vehicle.location.poi || "No Nearest POI"}
      </p>
      {vehicle.location.insidePOI && (
        <p className="text-xs text-green-600">Inside POI</p>
      )}
      <p className="text-sm">
        👤 {vehicle.driver.name} / {vehicle.driver.contact}
      </p>

      {/* Info Slider */}
      <div className="mt-3 flex overflow-x-auto space-x-3 no-scrollbar">
        {/* LAT */}
        <div className="min-w-[80px] bg-white dark:bg-gray-800 rounded-xl p-2 shadow text-center">
          <p className="text-sm font-medium">{vehicle.location.lat}</p>
          <p className="text-xs text-gray-500">Lat</p>
        </div>

        {/* LNG */}
        <div className="min-w-[80px] bg-white dark:bg-gray-800 rounded-xl p-2 shadow text-center">
          <p className="text-sm font-medium">{vehicle.location.lng}</p>
          <p className="text-xs text-gray-500">Lng</p>
        </div>

        {/* SPEED */}
        <div className="min-w-[80px] bg-white dark:bg-gray-800 rounded-xl p-2 shadow text-center">
          <p className="text-sm font-medium">{vehicle.status.speed} km/h</p>
          <p className="text-xs text-gray-500">Speed</p>
        </div>

        {/* IGNITION */}
        <div className="min-w-[80px] bg-white dark:bg-gray-800 rounded-xl p-2 shadow text-center">
          <p
            className={`text-sm font-medium ${
              vehicle.status.ignition ? "text-green-600" : "text-red-600"
            }`}
          >
            {vehicle.status.ignition ? "On" : "Off"}
          </p>
          <p className="text-xs text-gray-500">Ignition</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
