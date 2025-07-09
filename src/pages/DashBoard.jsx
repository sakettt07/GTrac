import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import MapSection from "../components/MapSection";
import { TbArrowsLeft } from "react-icons/tb";
import Sidebar from "../components/Sidebar";

const DashBoard = () => {
  const [showRoute, setShowRoute] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:text-white">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar
        onSelect={() => {
          setShowRoute(false);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      <div
        className="md:ml-20 bg-black mt-16 flex h-[calc(100vh-4rem)] relative"
        ref={containerRef}
      >
        {/* Content Section */}
        <div
          className="h-full overflow-auto p-2"
          style={{ width: `${leftWidth}%` }}
        >
          <Content onShowRoute={handleShowRoute} />
        </div>

        {/* Resizer */}
        <div
          onMouseDown={startDragging}
          onClick={handleToggleClick}
          className="w-2 cursor-col-resize bg-gray-400 hover:bg-gray-500 transition relative z-10 flex justify-center items-center"
        >
          <TbArrowsLeft className="text-white rotate-90" />
        </div>

        {/* Map Section */}
        <div
          className="h-full"
          style={{ width: `${100 - leftWidth}%`, minWidth: "10%" }}
        >
          <MapSection showRoute={showRoute} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
