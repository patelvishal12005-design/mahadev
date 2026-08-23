import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem('decor_selected_location') || 'Ahmedabad'
  );
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/locations/?active_only=true');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      // Fallback default list
      setLocations([
        { id: 1, name: 'Ahmedabad', slug: 'ahmedabad' },
        { id: 2, name: 'Gandhinagar', slug: 'gandhinagar' },
        { id: 3, name: 'Surat', slug: 'surat' },
        { id: 4, name: 'Vadodara', slug: 'vadodara' },
        { id: 5, name: 'Mumbai', slug: 'mumbai' },
        { id: 6, name: 'Pune', slug: 'pune' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const changeLocation = (locName) => {
    setSelectedLocation(locName);
    localStorage.setItem('decor_selected_location', locName);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        changeLocation,
        locations,
        loading,
        refreshLocations: fetchLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
