import React, { useState } from "react";
import { ImLocation2 } from "react-icons/im";
import { TbSteeringWheelFilled } from "react-icons/tb";
import { BsPinMapFill } from "react-icons/bs";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { preconnect } from "react-dom";
import { RxCross2 } from "react-icons/rx";

const VehicleCard = ({ vehicle, onClick }) => {
  const [driverModal, setDriverModal] = useState(false);
  // Extract with fallbacks
  const driverName = vehicle.driver?.trim() ? vehicle.driver : "TBM";
  const driverPhone = vehicle.phone?.trim() ? vehicle.phone : "TBM";

  // Lat/Lng cleanup
  const lat = !isNaN(parseFloat(vehicle.lat))
    ? parseFloat(vehicle.lat).toFixed(3)
    : "TBM";
  const lng = !isNaN(parseFloat(vehicle.lng))
    ? parseFloat(vehicle.lng).toFixed(3)
    : "TBM";

  const toggleDriverModal = () => {
    setDriverModal(!driverModal);
  };
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

  return (
    <div
      className="border rounded-lg p-3 bg-gray-50 shadow-xl cursor-pointer"
      onClick={() => onClick(vehicle)}
    >
      <p className="text-black font-bold">{vehicle.vehicleNumber}</p>
      {vehicle.raw.gpsDtl.mode == "RUNNING" ? (
        <p className="text-xs text-green-700 mb-1 font-semibold"></p>
      ) : (
        <p className="text-xs text-red-700 mb-1 font-semibold">
          Stopped since {vehicle.raw.gpsDtl.hatledSince}
        </p>
      )}
      {vehicle.raw.gpsDtl.mode == "RUNNING" ? (
        <p className="text-xs text-green-700 mb-1 font-semibold">
          Last data received at {vehicle.raw.gpsDtl.latLngDtl.gpstime}
        </p>
      ) : (
        <p className="text-xs text-red-700 mb-1 font-semibold">
          Last data received at {vehicle.raw.gpsDtl.latLngDtl.gpstime}
        </p>
      )}
      <p className="text-sm text-black flex items-center gap-2">
        <BsPinMapFill />{" "}
        {formatLocationString(vehicle.location) || "No address"}
      </p>
      <p className="text-sm flex items-center text-black gap-2">
        <ImLocation2 /> {vehicle.location?.poi || "No Nearest POI"}
      </p>
      {vehicle.location?.insidePOI && (
        <p className="text-xs text-green-600">Inside POI</p>
      )}
      <p className="text-sm text-black flex items-center gap-2">
        <TbSteeringWheelFilled />
        {driverName} / {driverPhone}
        <HiArrowTopRightOnSquare
          className="text-blue-500 hover:text-blue-700"
          onClick={toggleDriverModal}
        />
      </p>

      {driverModal && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-black/80 to-black/60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-center text-black">
                Modify Driver
              </h2>
              <RxCross2
                className="text-black"
                onClick={toggleDriverModal}
                size={20}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-gray-500 text-[14px]">Vehicle</p>
              <p className="text-gray-800 text-[17px]">Vehicle Number</p>
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-4"></div>
            <form action="">
              <label
                htmlFor=""
                className="text-black text-[15px] font-semibold"
              >
                Driver Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 py-1 mt-2 mb-2 text-gray-700 text-[14px]"
                placeholder="Enter Driver's Name"
              />
              <label htmlFor="" className="text-black text-[14px] mt-3">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 py-1 mt-2 text-gray-700 text-[14px]"
                placeholder="Enter Driver's phone number"
              />
              <div className="w-full h-[1px] bg-gray-300 my-4"></div>
            </form>
            <div className="flex justify-end gap-2">
              <button className="bg-transparent border text-black border-black hover:border-[#52ae8f] rounded-md px-5 hover:text-[#52ae8f]">
                Cancel
              </button>
              <button className="bg-[#52ae8f] rounded-md px-5 py-[5px]">
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Slider */}
      <div className="mt-3 flex overflow-x-auto space-x-1 no-scrollbar">
        {/* LAT */}
        <div className="min-w-[80px] bg-white-300 border border-gray-500 rounded-xl p-2 shadow-lg text-center">
          <div className="flex flex-col">
            <p className="text-sm text-[#52ae8f] font-semibold">{lat}/</p>
            <p className="text-sm text-[#52ae8f] font-semibold">{lng}</p>
          </div>

          <p className="text-xs text-black">Lat/Lng</p>
        </div>

        {/* LNG */}
        <div className="min-w-[80px] bg-white-300 border border-gray-500  rounded-xl p-2 shadow text-center">
          <p className="text-sm text-black font-semibold">
            {vehicle.raw.gpsDtl.acState}
          </p>
          <p className="text-xs text-gray-500">Ac</p>
        </div>

        {/* SPEED */}
        <div className="min-w-[80px] bg-white-300 border border-gray-500 rounded-xl p-2 shadow text-center">
          <p className="text-sm text-black font-semibold">
            {vehicle.speed} km/h
          </p>
          <p className="text-xs text-gray-500">Speed</p>
        </div>

        {/* IGNITION */}
        <div className="min-w-[80px] bg-white-300 border border-gray-500 rounded-xl p-2 shadow text-center">
          <p
            className={`text-sm font-semibold ${
              vehicle.ignition == "Off" ? "text-red-600" : "text-green-600"
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
