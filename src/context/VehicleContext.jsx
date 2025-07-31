// contexts/VehicleContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  vehicles: [],
  logs: [],
  loading: false,
  error: null,
  selectedVehicle: null,
  activeFilter: 'All',
  timeFilter: 'today',
  lastUpdated: null,
  isRefreshing: false,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_VEHICLES: 'SET_VEHICLES',
  SET_LOGS: 'SET_LOGS',
  SET_SELECTED_VEHICLE: 'SET_SELECTED_VEHICLE',
  SET_ACTIVE_FILTER: 'SET_ACTIVE_FILTER',
  SET_TIME_FILTER: 'SET_TIME_FILTER',
  SET_REFRESHING: 'SET_REFRESHING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Reducer function
const vehicleReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_VEHICLES:
      return { 
        ...state, 
        vehicles: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: new Date().toISOString(),
        isRefreshing: false
      };
    
    case ActionTypes.SET_LOGS:
      return { ...state, logs: action.payload };
    
    case ActionTypes.SET_SELECTED_VEHICLE:
      return { ...state, selectedVehicle: action.payload };
    
    case ActionTypes.SET_ACTIVE_FILTER:
      return { ...state, activeFilter: action.payload };
    
    case ActionTypes.SET_TIME_FILTER:
      return { ...state, timeFilter: action.payload };
    
    case ActionTypes.SET_REFRESHING:
      return { ...state, isRefreshing: action.payload };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.RESET_STATE:
      return { ...initialState };
    
    default:
      return state;
  }
};
const port = import.meta.env.VITE_PORT || 8089;


// Create context
const VehicleContext = createContext();

// API configuration
const API_CONFIG = {
  baseUrl: `https://gtrac.in:${port}/trackingDashboard/getListVehiclesmob`,
  token: "55042",
  userid: "82885",
  puserid: "1",
};

// Context provider component
export const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);

  // Transform API data to match component format
  const transformVehicleData = (apiData) => {
    return apiData.list.map((vehicle) => ({
      id: vehicle.vId,
      vehicleNumber: vehicle.vehReg,
      driver: vehicle.drivers?.driverName || "N/A",
      phone: vehicle.drivers?.phoneNumber || "N/A",
      status: vehicle.gpsDtl?.mode || "Unknown",
      location: vehicle.gpsDtl?.latLngDtl?.addr || "Unknown Location",
      poi: vehicle.gpsDtl?.latLngDtl?.poi || "No POI",
      speed: vehicle.gpsDtl?.speed || 0,
      fuel: vehicle.gpsDtl?.fuel || 0,
      lastUpdate: vehicle.gpsDtl?.latLngDtl?.gmstime || "Unknown",
      modeTime: vehicle.gpsDtl?.modeTime || "0 min",
      ignition: vehicle.gpsDtl?.ignState || "Off",
      battery: vehicle.gpsDtl?.percentageBttry || "0%",
      lat: vehicle.gpsDtl?.latLngDtl?.lat || 0,
      lng: vehicle.gpsDtl?.latLngDtl?.lng || 0,
      yesterdayKM: vehicle.gpsDtl?.Yesterday_KM || 0,
      odometer: vehicle.gpsDtl?.tel_odometer || 0,
      alertCount: vehicle.gpsDtl?.alertCount || 0,
      vehicleState: vehicle.vehicleState || "Unknown",
      haltedSince: vehicle.gpsDtl?.hatledSince || "Unknown",
      angle: vehicle.gpsDtl?.angle || 0,
      temperature: vehicle.gpsDtl?.temperature || null,
      voltage: vehicle.gpsDtl?.volt || null,
      raw: vehicle, // Keep original data for detailed view
    }));
  };

  // Generate logs from vehicle data
  const generateLogs = (vehicles) => {
    return vehicles.map((vehicle, index) => ({
      id: index + 1,
      type: index % 3 === 0 ? "Alert" : index % 3 === 1 ? "Stoppages" : "Movement",
      time: vehicle.lastUpdate,
      message: `${vehicle.vehicleNumber} - ${vehicle.status}`,
      location: vehicle.location,
      details: `Speed: ${vehicle.speed} km/h, Fuel: ${vehicle.fuel}%`,
      vehicleId: vehicle.id,
    }));
  };

  // Fetch vehicles function
  const fetchVehicles = async (mode = "", isRefresh = false) => {
    try {
      if (isRefresh) {
        dispatch({ type: ActionTypes.SET_REFRESHING, payload: true });
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      }
      
      dispatch({ type: ActionTypes.CLEAR_ERROR });

      const params = new URLSearchParams({
        token: API_CONFIG.token,
        userid: API_CONFIG.userid,
        puserid: API_CONFIG.puserid,
        mode: mode,
      });

      const response = await fetch(`${API_CONFIG.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.list || !Array.isArray(data.list)) {
        throw new Error('Invalid API response format');
      }

      const transformedVehicles = transformVehicleData(data);
      const generatedLogs = generateLogs(transformedVehicles);

      dispatch({ type: ActionTypes.SET_VEHICLES, payload: transformedVehicles });
      dispatch({ type: ActionTypes.SET_LOGS, payload: generatedLogs });

    } catch (error) {
      console.error("Error fetching vehicles:", error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Fetch vehicles by filter
  const fetchVehiclesByFilter = async (filter) => {
    const modeMap = {
      All: "",
      Running: "RUNNING",
      Idle: "IDLE",
      Stopped: "STOPPED",
      POI: "POI",
      Alert: "ALERT",
    };

    dispatch({ type: ActionTypes.SET_ACTIVE_FILTER, payload: filter });
    await fetchVehicles(modeMap[filter] || "");
  };

  // Refresh vehicles
  const refreshVehicles = async () => {
    const modeMap = {
      All: "",
      Running: "RUNNING",
      Idle: "IDLE",
      Stopped: "STOPPED",
      POI: "POI",
      Alert: "ALERT",
    };

    await fetchVehicles(modeMap[state.activeFilter] || "", true);
  };

  // Get filtered vehicles
  const getFilteredVehicles = () => {
    if (state.activeFilter === "All") return state.vehicles;
    return state.vehicles.filter(
      (vehicle) => vehicle.status?.toLowerCase() === state.activeFilter.toLowerCase()
    );
  };

  // Get filtered logs
  const getFilteredLogs = (tabFilter = "All") => {
    if (tabFilter === "") return state.logs;
    return state.logs.filter(
      (log) => log.type.toLowerCase() === tabFilter.toLowerCase()
    );
  };

  // Get vehicle by ID
  const getVehicleById = (id) => {
    return state.vehicles.find(vehicle => vehicle.id === id);
  };

  // Get logs for specific vehicle
  const getLogsByVehicleId = (vehicleId, tabFilter = "All") => {
    const vehicleLogs = state.logs.filter(log => log.vehicleId === vehicleId);
    if (tabFilter === "All") return vehicleLogs;
    return vehicleLogs.filter(
      (log) => log.type.toLowerCase() === tabFilter.toLowerCase()
    );
  };

  // Actions
  const actions = {
    fetchVehicles,
    fetchVehiclesByFilter,
    refreshVehicles,
    setSelectedVehicle: (vehicle) => 
      dispatch({ type: ActionTypes.SET_SELECTED_VEHICLE, payload: vehicle }),
    setActiveFilter: (filter) => 
      dispatch({ type: ActionTypes.SET_ACTIVE_FILTER, payload: filter }),
    setTimeFilter: (filter) => 
      dispatch({ type: ActionTypes.SET_TIME_FILTER, payload: filter }),
    clearError: () => 
      dispatch({ type: ActionTypes.CLEAR_ERROR }),
    resetState: () => 
      dispatch({ type: ActionTypes.RESET_STATE }),
  };

  // Selectors
  const selectors = {
    getFilteredVehicles,
    getFilteredLogs,
    getVehicleById,
    getLogsByVehicleId,
  };

  // Initial data fetch
  useEffect(() => {
    fetchVehicles();
  }, []);

  const contextValue = {
    ...state,
    ...actions,
    ...selectors,
  };

  return (
    <VehicleContext.Provider value={contextValue}>
      {children}
    </VehicleContext.Provider>
  );
};

// Custom hook to use the context
export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};

// Export context for advanced use cases
export { VehicleContext };