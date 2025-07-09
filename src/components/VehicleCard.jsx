import React from "react";

const VehicleCard = ({ vehicle, onClick }) => {
  console.log(vehicle)
  return (
    <div
      className="border rounded-lg p-3 bg-gray-50 shadow-xl cursor-pointer"
      onClick={() => onClick(vehicle)}
    >
      <p className="text-blue-700 font-semibold">{vehicle.vehicleNumber}</p>
      <p className="text-xs text-black mb-1">
        Last data received at {vehicle.lastUpdated}
      </p>
      <p className="text-sm text-black">
        📍 {vehicle.location.poi || "No Nearest POI"}
      </p>
      {vehicle.location.insidePOI && (
        <p className="text-xs text-green-600">Inside POI</p>
      )}
      <p className="text-sm text-black">
        👤 {vehicle.driver} / {vehicle.phone}
      </p>

      {/* Info Slider */}
      <div className="mt-3 flex overflow-x-auto space-x-3 no-scrollbar">
        {/* LAT */}
        <div className="min-w-[80px] bg-gray-300 rounded-xl p-2 shadow text-center">
          <p className="text-sm text-black font-medium">{vehicle.lat}</p>
          <p className="text-xs text-gray-500">Lat</p>
        </div>

        {/* LNG */}
        <div className="min-w-[80px] bg-gray-300  rounded-xl p-2 shadow text-center">
          <p className="text-sm text-black font-medium">{vehicle.lng}</p>
          <p className="text-xs text-gray-500">Lng</p>
        </div>

        {/* SPEED */}
        <div className="min-w-[80px] bg-gray-300 rounded-xl p-2 shadow text-center">
          <p className="text-sm text-black font-medium">{vehicle.speed} km/h</p>
          <p className="text-xs text-gray-500">Speed</p>
        </div>

        {/* IGNITION */}
        <div className="min-w-[80px] bg-gray-300 rounded-xl p-2 shadow text-center">
          <p
            className={`text-sm font-medium ${
              vehicle.ignition ? "text-red-600" : "text-green-600"
            }`}
          >
            {vehicle.ignition}
          </p>
          <p className="text-xs text-gray-500">Ignition</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
