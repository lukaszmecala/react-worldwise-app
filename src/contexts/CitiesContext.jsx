import { useCallback, useReducer } from "react";
import { useEffect, useState, createContext, useContext } from "react";

const CitiesContxt = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCities: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loaded":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCities: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCities: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCities: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // const [currentCities, setCurrentCities] = useState({});

  const [{ cities, isLoading, currentCities }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const BASE_URL = "http://localhost:8000";

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loaded" });
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Failed to fetch cities" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCities.id) return;
      try {
        dispatch({ type: "loaded" });
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Failed to fetch cities" });
      }
    },
    [currentCities.id]
  );
  async function createCity(newCity) {
    try {
      dispatch({ type: "loaded" });
      const response = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Failed to create cities" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loaded" });
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Failed to delete cities" });
    }
  }

  return (
    <CitiesContxt.Provider
      value={{
        cities,
        isLoading,
        currentCities,
        getCity,
        createCity,
        deleteCity,
      }}
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
