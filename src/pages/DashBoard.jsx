import React,{useState} from 'react'
import Navbar from '../components/Navbar';
import Content from '../components/Content';
import MapSection from '../components/MapSection';
import Sidebar from '../components/Sidebar';

const DashBoard = () => {
  const [showRoute, setShowRoute] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleShowRoute = () => setShowRoute(true);

  return (
    <div className="h-screen w-screen overflow-hidden dark:bg-gray-900 dark:text-white">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar
        onSelect={(section) => {
          setShowRoute(false);
          setSidebarOpen(false); // auto-close sidebar on mobile
        }}
        isOpen={sidebarOpen}
      />

      <div className="md:ml-20 mt-16 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        <div className="w-full md:w-1/2 overflow-auto p-4">
          <Content onShowRoute={handleShowRoute} />
        </div>
        <div className="w-full md:w-1/2">
          <MapSection showRoute={showRoute} />
        </div>
      </div>
    </div>
  );
}

export default DashBoard