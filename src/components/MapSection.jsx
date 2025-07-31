import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import truckIconImg from "/leaflet/truck-red.png";
import { GrSatellite } from "react-icons/gr";
import { TbMapPin2 } from "react-icons/tb";
import { useVehicle } from "../context/VehicleContext";

const truckIcon = new L.Icon({
  iconUrl: truckIconImg,
  iconSize: [69, 69],
  iconAnchor: [0, 0],
  popupAnchor: [0, -40],
});

const MapSection = ({ selectedVehicleNumbers }) => {
  const { vehicles } = useVehicle();

  const [path, setPath] = useState([]);
  const [center, setCenter] = useState([29.12368, 76.40516]);
  const [startInfo, setStartInfo] = useState(null);
  const [endInfo, setEndInfo] = useState(null);
  const [isSatelliteView, setIsSatelliteView] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [truckPosition, setTruckPosition] = useState(null);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(1);

  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showStartEndMarkers, setShowStartEndMarkers] = useState(false);
  const [showTruckMarker, setShowTruckMarker] = useState(false);
  const [useLiveAPI, setUseLiveAPI] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef(null);
  const pathDataRef = useRef([]);
  const mapRef = useRef();

  const port = import.meta.env.VITE_PORT || 8089;
  const visibleVehicles =
    selectedVehicleNumbers?.length > 0
      ? vehicles.filter((v) => selectedVehicleNumbers.includes(v.vehicleNumber))
      : vehicles;

  // Play animation
  useEffect(() => {
    if (isPlaying && pathDataRef.current.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentPosition((prev) => {
          const next = prev + playSpeed;
          if (next >= pathDataRef.current.length - 1) {
            setIsPlaying(false);
            return pathDataRef.current.length - 1;
          }
          const point = pathDataRef.current[Math.floor(next)];
          setTruckPosition([point.lat, point.lng]);
          setJourneyProgress((next / (pathDataRef.current.length - 1)) * 100);
          return next;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, playSpeed]);

  const resetJourney = () => {
    setIsPlaying(false);
    setCurrentPosition(0);
    setJourneyProgress(0);
    if (pathDataRef.current.length > 0) {
      setTruckPosition([
        pathDataRef.current[0].lat,
        pathDataRef.current[0].lng,
      ]);
    }
  };

  const formatTime = (position) => {
    const point = pathDataRef.current[Math.floor(position)];
    if (!point?.datetime) return "00:00";
    const date = new Date(point.datetime);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleVehicleMarkerClick = async (vehicle) => {
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const startStr = start.toISOString().replace("T", " ").slice(0, 19);
    const endStr = now.toISOString().replace("T", " ").slice(0, 19);

    try {
      const res = await fetch(
        `https://gtrac.in:${port}/trackingDashboard/getpathwithDateDaignostic?vId=${vehicle.id}&startdate=${startStr}&enddate=${endStr}&requestfor=0&userid=82885`
      );
      const data = await res.json();

      if (
        data.success &&
        Array.isArray(data.patharry) &&
        data.patharry.length > 0
      ) {
        const pathArray = data.patharry;
        pathDataRef.current = pathArray;
        const polylinePoints = pathArray.map((point) => [point.lat, point.lng]);
        setPath(polylinePoints);
        setCenter([pathArray[0].lat, pathArray[0].lng]);
        setStartInfo(pathArray[0]);
        setEndInfo(pathArray[pathArray.length - 1]);
        setTruckPosition([pathArray[0].lat, pathArray[0].lng]);
        setShowStartEndMarkers(true);
        setShowTruckMarker(true);
      } else {
        setPath([]);
        setShowTruckMarker(false);
        setShowStartEndMarkers(false);
      }
    } catch (error) {
      console.error("Error fetching path data:", error);
    }
  };
  useEffect(() => {
    if (selectedVehicleNumbers?.length > 0 && visibleVehicles.length > 0) {
      // Automatically show polyline for the first selected vehicle
      handleVehicleMarkerClick(visibleVehicles[0]);
    }
  }, [selectedVehicleNumbers]);

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
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsSatelliteView((prev) => !prev)}
          className="bg-white hover:bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-lg border"
        >
          {isSatelliteView ? <TbMapPin2 /> : <GrSatellite />}
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full z-0"
        ref={mapRef}
      >
        <TileLayer
          url={
            isSatelliteView
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {visibleVehicles.map((vehicle) => (
          <Marker
            key={vehicle.vehicleNumber}
            position={[vehicle.lat, vehicle.lng]}
            icon={truckIcon}
            eventHandlers={{
              click: () => handleVehicleMarkerClick(vehicle),
            }}
          >
            <Popup>
              <strong>{vehicle.vehicleNumber}</strong>
              <br />
              Location: {formatLocationString(vehicle.location)}
            </Popup>
          </Marker>
        ))}

        {showStartEndMarkers && startInfo && (
          <Marker position={[startInfo.lat, startInfo.lng]}>
            <Popup>
              <strong>Start:</strong> {startInfo.location}
              <br />
              Time: {startInfo.datetime}
            </Popup>
          </Marker>
        )}

        {showStartEndMarkers && endInfo && (
          <Marker position={[endInfo.lat, endInfo.lng]}>
            <Popup>
              <strong>End:</strong> {endInfo.location}
              <br />
              Time: {endInfo.datetime}
            </Popup>
          </Marker>
        )}

        {showTruckMarker && truckPosition && (
          <Marker position={truckPosition} icon={truckIcon}>
            <Popup>
              <strong>Truck:</strong>
              <br />
              Time: {formatTime(currentPosition)}
            </Popup>
          </Marker>
        )}

        {path.length > 1 && (
          <Polyline
            positions={path}
            color="blue"
            weight={4}
            opacity={0.8}
            lineJoin="round"
          />
        )}
      </MapContainer>

      {showProgressBar && (
        <div className="absolute bottom-4 left-4 right-4 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatTime(0)}</span>
                <span>Progress: {Math.round(journeyProgress)}%</span>
                <span>{formatTime(pathDataRef.current.length - 1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={journeyProgress}
                onChange={(e) => {
                  const progress = parseFloat(e.target.value);
                  const newPos =
                    (progress / 100) * (pathDataRef.current.length - 1);
                  setCurrentPosition(newPos);
                  const pos = pathDataRef.current[Math.floor(newPos)];
                  setTruckPosition([pos.lat, pos.lng]);
                  setJourneyProgress(progress);
                }}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={resetJourney}
                className="bg-gray-100 px-3 text-black py-1 rounded hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <div className="flex gap-2 items-center text-sm">
                <span>Speed:</span>
                {[0.5, 1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaySpeed(s)}
                    className={`px-2 py-1 rounded text-black ${
                      s === playSpeed
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <div className="font-mono text-sm">
                {formatTime(currentPosition)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="p-3 bg-white shadow-lg rounded-full hover:bg-gray-100"
          >
            ⚙️
          </button>
          {showSettings && (
            <div className="absolute bottom-14 right-0 bg-white text-black border shadow-lg p-4 rounded-lg w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Use Live API</span>
                <input
                  type="checkbox"
                  checked={useLiveAPI}
                  onChange={() => setUseLiveAPI(!useLiveAPI)}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Show Progress Bar</span>
                <input
                  type="checkbox"
                  checked={showProgressBar}
                  onChange={() => setShowProgressBar(!showProgressBar)}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Start/End Markers</span>
                <input
                  type="checkbox"
                  checked={showStartEndMarkers}
                  onChange={() => setShowStartEndMarkers(!showStartEndMarkers)}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Truck Marker</span>
                <input
                  type="checkbox"
                  checked={showTruckMarker}
                  onChange={() => setShowTruckMarker(!showTruckMarker)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSection;
