import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import MapSection from "../components/MapSection";
import { TbArrowsLeft, TbMap, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import Sidebar from "../components/Sidebar";

const DashBoard = () => {
  const [showRoute, setShowRoute] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [selectedVehicleNumbers, setSelectedVehicleNumbers] = useState([]);
  const [isFullMap, setIsFullMap] = useState(false);

  const containerRef = useRef(null);

  const handleShowRoute = () => setShowRoute(true);

  const startDragging = () => setIsDragging(true);

  const stopDragging = () => setIsDragging(false);

  const handleDragging = (e) => {
    if (!isDragging || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMultipleVehicleSearch = (vehicleNumbers) => {
    setSelectedVehicleNumbers(vehicleNumbers);
  };

  // Listen to mousemove and mouseup globally
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragging);
      document.addEventListener("mouseup", stopDragging);
    } else {
      document.removeEventListener("mousemove", handleDragging);
      document.removeEventListener("mouseup", stopDragging);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragging);
      document.removeEventListener("mouseup", stopDragging);
    };
  }, [isDragging]);

  // Toggle full/half view on click
  const handleToggleClick = () => {
    if (leftWidth < 30) {
      setLeftWidth(50); // restore
    } else {
      setLeftWidth(100); // full Content view
    }
  };

  // Toggle full map view
  const handleMapToggle = () => {
    setIsFullMap(!isFullMap);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:text-white">
      <Navbar
        onMultiVehicleSearch={handleMultipleVehicleSearch}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        onSelect={() => {
          setShowRoute(false);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      <div
        className="md:ml-20 bg-white mt-16 flex h-[calc(100vh-4rem)] relative"
        ref={containerRef}
      >
        {/* Content Section */}
        <div
          className={`overflow-hidden transition-all duration-300 ${isFullMap ? 'hidden' : ''}`}
          style={{ width: `${leftWidth}%`, height: "100%" }}
        >
          <div className="h-full overflow-y-auto p-2">
            <Content
              selectedVehicleNumbers={selectedVehicleNumbers}
              onShowRoute={handleShowRoute}
            />
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={startDragging}
          onClick={handleToggleClick}
          className={`w-2 cursor-col-resize bg-black hover:bg-gray-800 transition relative z-10 flex justify-center items-center ${isFullMap ? 'hidden' : ''}`}
        >
          <TbArrowsLeft className="text-white rotate-90" />
        </div>

        {/* Map Toggle Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleMapToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
            title={isFullMap ? "Content Panel" : "Map View"}
          >
            {isFullMap ? (
              <>
                <TbLayoutSidebarLeftExpand title="View Content" className="text-lg" />
              </>
            ) : (
              <>
                <TbMap title="View Map" className="text-lg" />
              </>
            )}
          </button>
        </div>

        {/* Map Section */}
        <div
          className={`h-full transition-all duration-300 ${isFullMap ? 'w-full' : ''}`}
          style={{ width: isFullMap ? '100%' : `${100 - leftWidth}%`, minWidth: "10%" }}
        >
          <MapSection selectedVehicleNumbers={selectedVehicleNumbers} showRoute={showRoute} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;