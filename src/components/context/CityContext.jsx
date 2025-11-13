import React, { createContext, useContext, useState, useEffect } from "react";

const CityContext = createContext();

export const useCity = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "همه استان‌ها";
  });

  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCity);
  }, [selectedCity]);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
};
