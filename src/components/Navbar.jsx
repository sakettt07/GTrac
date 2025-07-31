import { useEffect, useState, useRef } from "react";
import { MapPinHouse, Menu, SlidersHorizontal } from "lucide-react";
import logo from "../assets/logoo.png";
import { IoSettingsOutline, IoNotificationsCircle } from "react-icons/io5";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import notificationData from "../assets/vehicle.json";
import NotificationCard from "./NotificationCard";
import Select, { components } from "react-select";
import { useVehicle } from "../context/VehicleContext";

const MAX_DISPLAY = 2;  

const CustomValueContainer = ({ children, ...props }) => {
  const selected = props.getValue();
  const toDisplay = selected.slice(0, MAX_DISPLAY);
  const extraCount = selected.length - MAX_DISPLAY;

  const handleRemove = (value) => {
    const newValue = selected.filter((option) => option.value !== value);
    props.setValue(newValue);
  };

  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center gap-1 overflow-hidden">
        {toDisplay.map((val) => (
          <div
            key={val.value}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
          >
            {val.label}
            <button
              className="ml-1 text-red-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(val.value);
              }}
            >
              <RxCross2 size={12} />
            </button>
          </div>
        ))}
        {extraCount > 0 && (
          <div className="text-xs text-gray-600 font-medium">
            +{extraCount} more
          </div>
        )}
      </div>
      {children[1]}
    </components.ValueContainer>
  );
};

const Navbar = ({ onToggleSidebar, onMultiVehicleSearch }) => {
  const [toggleNotificationModal, setToggleNotificationModal] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [settingMenu, setSettingMenu] = useState(false);
  const [showPOIModal, setShowPOIModal] = useState(false);
  const [userButton, setUserButton] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [theme, setTheme] = useState("Dark");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [vehicleeOptions, setVehicleeOptions] = useState([]);
  const [poiForm, setPoiForm] = useState({
    name: "",
    radius: "",
    latitude: "",
    longitude: "",
  });
  const {vehicles}=useVehicle();
  const dropdownRef = useRef(null);

  const toggleFilterPanel = () => {
    setToggleFilter((prev) => !prev);
  };

  const toggleUserButton = () => {
    setUserButton((prev) => !prev);
  };

  const toggleTheme = () => {
    if (theme === "Dark") {
      setTheme("Light");
    } else {
      setTheme("Dark");
    }
  };

  const toggleNotificationPanel = () => {
    setToggleNotificationModal((prev) => !prev);
  };

  const toggleSettingsPanel = () => {
    setSettingMenu((prev) => !prev);
  };
  // button for the POI handling
  const handlePOIChange = (e) => {
    setPoiForm({ ...poiForm, [e.target.name]: e.target.value });
  };

  const handleSubmitPOI = () => {
    setShowPOIModal(false);
  };

  const handleCancelPOI = () => {
    setPoiForm({ name: "", radius: "", latitude: "", longitude: "" });
    setShowPOIModal(false);
  };
  const handleMultiVehicleSearch = () => {
    const selectedNumbers = selectedOptions.map((opt) => opt.value);
    if (onMultiVehicleSearch) {
      onMultiVehicleSearch(selectedNumbers);
    }
  };

  const vehicleOptions = vehicles.map((v) => ({
    value: v.vehicleNumber,
    label: v.vehicleNumber,
  }));
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSettingMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 border-b bg-white text-white flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={onToggleSidebar}>
            <Menu />
          </button>
          <Link to={"/"}>
            <img className="w-20" src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="flex w-full justify-end items-center gap-2 relative">
          <div className="flex items-center justify-end w-full p-2 relative">
            <div className="flex w-full justify-end items-center gap-4">
              <div className="flex items-center w-full max-w-[750px] justify-end">
                <MapPinHouse
                  className="rounded-full bg-emerald-600 text-white p-1"
                  size={28}
                />
                <SlidersHorizontal
                  className="text-black text-2xl hover:text-gray-500 cursor-pointer mx-3"
                  onClick={toggleFilterPanel}
                />
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  options={vehicleOptions}
                  value={selectedOptions}
                  onChange={setSelectedOptions}
                  placeholder="Search multiple vehicles"
                  className="w-[450px] ml-2 text-gray-700"
                  components={{ ValueContainer: CustomValueContainer }}
                  styles={{
                    valueContainer: (base) => ({
                      ...base,
                      flexWrap: "nowrap",
                      overflow: "hidden",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      margin: "0 4px 0 0",
                    }),
                  }}
                />

                <button
                  className="bg-cyan-600 text-white px-5 py-2 rounded-md mr-2 hover:bg-cyan-700"
                  onClick={handleMultiVehicleSearch}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IoSettingsOutline
                onClick={toggleSettingsPanel}
                className="text-white text-2xl cursor-pointer bg-green-900 w-7 h-7 p-1 rounded-full"
              />
              <IoNotificationsCircle
                onClick={toggleNotificationPanel}
                className="text-white text-2xl bg-orange-600 w-7 h-7 p-1 rounded-full cursor-pointer"
              />
              <FaUser
                onClick={toggleUserButton}
                className="text-white text-2xl cursor-pointer bg-red-900 w-7 h-7 p-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>

      {settingMenu && (
        <div
          ref={dropdownRef}
          className="absolute top-14 right-20 bg-white shadow-lg rounded-md p-2 z-[80] w-40"
        >
          <button
            onClick={() => {
              setShowPOIModal(true);
              setSettingMenu(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black text-nowrap"
          >
            Create Manual POI
          </button>
        </div>
      )}
      {/* Conditional rendering for the filter panel */}
      {toggleFilter && (
        <div className="absolute right-[28rem] top-10 bg-white text-black w-[420px] p-5 rounded-md shadow-xl z-50 border border-gray-200">
          <div className="space-y-5">
            {/* Yesterday Running Hour */}
            <div>
              <label className="flex items-center font-semibold mb-1">
                <input type="radio" name="filter" className="mr-2" />
                Yesterday Running Hour
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Greater than Running Hrs."
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Less than Running Hrs."
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Today Idle Hours (Disabled) */}
            <div>
              <label className="flex items-center font-semibold mb-1">
                <input type="radio" name="filter" className="mr-2" />
                Today Idle Hours
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Greater than Idle Hrs."
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm cursor-not-allowed bg-gray-100"
                  disabled
                />
                <input
                  type="text"
                  placeholder="Less than Idle Hrs."
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm cursor-not-allowed bg-gray-100"
                  disabled
                />
              </div>
            </div>

            {/* Yesterday Kilometers (Disabled) */}
            <div>
              <label className="flex items-center font-semibold mb-1">
                <input type="radio" name="filter" className="mr-2" />
                Yesterday Kilometers
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Greater than Yesterday Km."
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm cursor-not-allowed bg-gray-100"
                  disabled
                />
                <input
                  type="text"
                  placeholder="Less than Yesterday Km."
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm cursor-not-allowed bg-gray-100"
                  disabled
                />
              </div>
            </div>

            {/* Yesterday Overspeed (Disabled) */}
            <div>
              <label className="flex items-center font-semibold mb-1">
                <input type="radio" name="filter" className="mr-2" />
                Yesterday Overspeed
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Greater than Yesterday Overspeed"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm cursor-not-allowed bg-gray-100"
                  disabled
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right pt-2">
              <button className="bg-emerald-700 text-white px-6 py-2 rounded hover:bg-emerald-800 transition-all">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed top-16 right-0 w-80 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          toggleNotificationModal ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black">Notifications</h2>
            <button
              onClick={toggleNotificationPanel}
              className="text-gray-500 hover:text-red-600 text-xl"
            >
              <RxCross2 />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto">
            {notificationData.notifications.map((notif, idx) => (
              <NotificationCard key={idx} {...notif} />
            ))}
          </div>
        </div>
      </div>

      {showPOIModal && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-black/80 to-black/60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
              onClick={() => setShowPOIModal(false)}
            >
              <RxCross2 size={20} />
            </button>

            <h2 className="text-lg font-semibold text-center mb-4 text-black">
              Create POI
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={poiForm.name}
                onChange={handlePOIChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              <input
                type="number"
                name="radius"
                placeholder="Radius (meters)"
                value={poiForm.radius}
                onChange={handlePOIChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              <input
                type="number"
                name="latitude"
                placeholder="Latitude"
                value={poiForm.latitude}
                onChange={handlePOIChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
              <input
                type="number"
                name="longitude"
                placeholder="Longitude"
                value={poiForm.longitude}
                onChange={handlePOIChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCancelPOI}
                  className="px-4 py-2 bg-gray-300 rounded-md text-black hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPOI}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {userButton && (
        <div
          ref={dropdownRef}
          className="absolute top-14 right-0 bg-white shadow-lg rounded-md p-2 z-50 w-44"
        >
          <button
            className="w-full text-center px-4 py-2 text-sm bg-gray-50 rounded-md  hover:bg-gray-300 text-black text-nowrap flex items-center gap-3"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <FaMoon className="text-gray-500" />
            ) : (
              <FaSun className="text-yellow-300" />
            )}
            Change Theme
          </button>
          <button className="w-full text-center px-4 py-2 text-sm bg-gray-50 rounded-md  hover:bg-gray-300 text-black text-nowrap mb-2">
            Change Password
          </button>
          <button
            onClick={() => {}}
            className="w-full text-center px-4 py-2 text-sm bg-orange-500 rounded-md  hover:bg-gray-100 text-black text-nowrap"
          >
            Logout
          </button>
        </div>
      )}

      {/* Selected Vehicles Display */}
      {selectedVehicles.length > 0 && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-md shadow-md px-4 py-2 z-40 flex flex-wrap gap-2 max-w-xl">
          {selectedVehicles.map((vehicle, index) => (
            <span
              key={index}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm text-black flex items-center gap-1"
            >
              {vehicle}
              <button
                className="ml-1 text-red-600"
                onClick={() =>
                  setSelectedVehicles((prev) =>
                    prev.filter((item) => item !== vehicle)
                  )
                }
              >
                <RxCross2 size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
