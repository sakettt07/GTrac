import React from "react";
import { FaMapMarkerAlt, FaRegClock, FaCarCrash, FaRoad } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoAlertCircleOutline } from "react-icons/io5";

const LogCard = ({ log }) => {
  const cardBase = "bg-white rounded-xl shadow-md p-4 border border-gray-200";
  const timestamp = new Date(log.time || log.startTime).toLocaleString();

  if (log.type === "movement") {
    return (
      <div className={cardBase}>
        <div className="flex justify-between text-sm font-semibold text-indigo-600">
          <span>Movement</span>
          <span>{timestamp}</span>
        </div>
        <p className="text-gray-800 mt-1">
          <FaRoad className="inline mr-2 text-blue-500" />
          Ran for: {log.duration}, Distance: {log.distance}
        </p>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            <FaMapMarkerAlt className="inline text-green-600 mr-2" />
            Start: {log.startLocation}
          </p>
          <p className="text-sm text-gray-600">
            <MdLocationOn className="inline text-red-600 mr-2" />
            End: {log.endLocation}
          </p>
        </div>
      </div>
    );
  }

  if (log.type === "stoppage") {
    return (
      <div className={cardBase}>
        <div className="flex justify-between text-sm font-semibold text-amber-600">
          <span>Stoppage</span>
          <span>{timestamp}</span>
        </div>
        <p className="text-gray-800 mt-1">
          <FaRegClock className="inline mr-2 text-amber-500" />
          Duration: {log.duration}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <FaMapMarkerAlt className="inline text-gray-700 mr-2" />
          Location: {log.location}
        </p>
      </div>
    );
  }

  if (log.type === "alert") {
    return (
      <div className={cardBase}>
        <div className="flex justify-between text-sm font-semibold text-red-600">
          <span>Alert - {log.alertType}</span>
          <span>{timestamp}</span>
        </div>
        <p className="text-sm text-gray-700 mt-2">
          <IoAlertCircleOutline className="inline text-red-500 mr-2" />
          Location: {log.location}
        </p>
      </div>
    );
  }

  return null;
};

export default LogCard;
