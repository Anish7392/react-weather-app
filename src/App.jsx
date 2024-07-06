import React, { useEffect, useState } from "react";
import { fetchWeather } from "./api/fetchWeather";
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchData = async (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        const data = await fetchWeather(cityName);
        setWeatherData(data);
        setRecentSearches(prevSearches => {
          const searches =  [cityName, ...prevSearches];
          localStorage.setItem('searches', JSON.stringify(searches));
          return searches;
        });
        setCityName("");
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggle = () => {
    localStorage.setItem('isCelsius', !isCelsius);
    setIsCelsius(!isCelsius);
  }

  const fetchWeatherForCity = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const searches =  JSON.parse(localStorage.getItem('searches')) || [];
    setRecentSearches(searches);
    const isCelsius =  JSON.parse(localStorage.getItem('isCelsius')) || true;
    setIsCelsius(isCelsius);
  }, [])

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={fetchData}
        />
      </div>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      {weatherData && (
        <div className="weather-container">
          <h2 className="weather-location">
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p className="weather-temp">
            Temperature: {isCelsius ? weatherData.current.temp_c : weatherData.current.temp_f} °{isCelsius ? 'C' : 'F'}
          </p>
          <p className="weather-condition">Condition: {weatherData.current.condition.text}</p>
          <img
            className="weather-icon"
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p className="weather-humidity">Humidity: {weatherData.current.humidity} %</p>
          <p className="weather-pressure">Pressure: {weatherData.current.pressure_mb} mb</p>
          <p className="weather-visibility">Visibility: {weatherData.current.vis_km} km</p>
        </div>
      )}
      <button className="toggle-button" onClick={handleToggle}>
        Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
      </button>
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3>Recent Searches</h3>
          <ul>
            {recentSearches.map((city, index) => (
              <li key={index} onClick={() => fetchWeatherForCity(city)}>{city}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;

