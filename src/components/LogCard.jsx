import React from "react";
import { FaMapMarkerAlt, FaRegClock, FaRoad } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoAlertCircleOutline } from "react-icons/io5";

const LogCard = ({ log, selectedVehicle }) => {
  const cardBase =
    "bg-white rounded-xl shadow-md p-4 border border-gray-200 w-full overflow-hidden";
  const textBase = "text-sm text-gray-600 break-words font-semibold";

  const timestamp = new Date(
    log.fromTimetoMatch || log.toTimetoMatch || log.time
  ).toLocaleString();
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

  const mode = log.mode;
  console.log(log);
  if (mode === "Running") {
    return (
      <div className={cardBase}>
        <div className="flex justify-between text-sm font-semibold text-green-800 flex-wrap gap-2">
          <span>Movement</span>
          <span className="text-right text-[12px]">{timestamp}</span>
        </div>
        <p className="text-gray-800 mt-1 break-words">
          <FaRoad className="inline mr-2 text-blue-500" />
          Ran for: {log.totalTime || "N/A"}, Distance:{" "}
          {log.totalDistance || "N/A"}
        </p>
        <div className="mt-2 space-y-1">
          <p className={textBase}>{formatLocationString(log.startLocation)}</p>
        </div>
      </div>
    );
  }

  if (mode === "Idle") {
    return (
      <div className={cardBase}>
        <div className="flex justify-between text-sm font-semibold text-red-400 flex-wrap gap-2">
          <span>Stoppage</span>
          <span className="text-right">{timestamp}</span>
        </div>
        <p className="text-gray-800 mt-1 break-words">
          <FaRegClock className="inline mr-2 text-amber-500" />
          Stopped for: {log.totalTime || "N/A"}
        </p>
        <p className={textBase}>{formatLocationString(log.startLocation)}</p>
      </div>
    );
  }

  if (mode === "Alert") {
    return (
      <div className={cardBase}>
        <div className="flex justify-between text-sm font-semibold text-red-600 flex-wrap gap-2">
          <span>Alert</span>
          <span className="text-right">{timestamp}</span>
        </div>
        <p className={textBase}>
          <IoAlertCircleOutline className="inline text-red-500 mr-2" />
          Location: {log.startLocation?.split("##")[0] || "N/A"}
        </p>
      </div>
    );
  }

  return null;
};

export default LogCard;
