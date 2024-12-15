import { useEffect, useState, createContext, useContext } from "react";

const CitiesContxt = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentCities, setCurrentCities] = useState({});

  const BASE_URL = "http://localhost:8000";

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        setCities(data);
        setIsLoading(false);
      } catch {
        alert("Failed to fetch cities");
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      setCurrentCities(data);
      setIsLoading(false);
    } catch {
      alert("Failed to fetch cities");
    }
  }

  return (
    <CitiesContxt.Provider
      value={{ cities, isLoading, currentCities, getCity }}
    >
      {children}
    </CitiesContxt.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContxt);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
