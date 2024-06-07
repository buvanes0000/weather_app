import React, { useEffect, useState } from 'react';
import "./app.css";
import searchIcon from "./assets/weathers/search.png";
import clear from "./assets/weathers/sunny.png";
import humidity from "./assets/weathers/humidity.png";
import wind from "./assets/weathers/wind.png";
import nightIcon from "./assets/weathers/night.png";
import cloudIcon from "./assets/weathers/cloudy.png";
import drizzleIcon from "./assets/weathers/drizzle.png";
import rainIcon from "./assets/weathers/rain.png";
import snowIcon from "./assets/weathers/snow.png";
import day_bg from "./assets/weathers/day.jpg";
import night_bg from "./assets/weathers/night.jpg";
import rain_bg from "./assets/weathers/rain.gif";
import wind_bg from "./assets/weathers/wind.gif";

const WeatherDetails = ({ icon, temp, country, city, latitude, longitude, hp, ws, feelsLike, sunrise, sunset, description }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather-icon" className='weather-image' />
      </div>
      <div className="temp">{temp} °C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="co-ordinates">
        <div className="latitude"><span>Latitude:</span><span>{latitude}</span></div>
        <div className="longitude"><span>Longitude:</span><span>{longitude}</span></div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity} className='element-icon' alt="humidity" />
          <div className="data">
            <div className="humidity-percentage">{hp} %</div>
            <div className="element-text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind} className='element-icon' alt="wind" />
          <div className="data">
            <div className="wind-speed">{ws} Km/hr</div>
            <div className="element-text">Wind</div>
          </div>
        </div>
      </div>
      <div className="additional-info">
        <div><strong>Feels like:</strong> {feelsLike} °C</div>
        <div><strong>Sunrise:</strong> {new Date(sunrise * 1000).toLocaleTimeString()}</div>
        <div><strong>Sunset:</strong> {new Date(sunset * 1000).toLocaleTimeString()}</div>
        <div><strong>Description:</strong> {description}</div>
      </div>
    </>
  );
};

const App = () => {
  const ApiKey = "5f65f27a8e7b43b1274251bc1b4edddd";
  const [text, setText] = useState("Tirunelveli");
  const [icon, setIcon] = useState(clear);
  const [temp, setTemp] = useState(26);
  const [city, setCity] = useState("Tirunelveli");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [hp, setHp] = useState();
  const [ws, setWs] = useState();
  const [feelsLike, setFeelsLike] = useState();
  const [sunrise, setSunrise] = useState();
  const [sunset, setSunset] = useState();
  const [description, setDescription] = useState();
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clear,
    "01n": nightIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const backgroundMap = {
    day: day_bg,
    night: night_bg,
    rain: rain_bg,
    wind: wind_bg
  };

  const determineBackground = (weather, iconCode) => {
    if (iconCode.endsWith("n")) {
      return backgroundMap.night;
    } else if (weather === "Rain") {
      return backgroundMap.rain;
    } else if (weather === "Wind") {
      return backgroundMap.wind;
    } else {
      return backgroundMap.day;
    }
  };

  const setBackgroundImage = (image) => {
    document.body.style.backgroundImage = `url(${image})`;
  };

  const searchData = async () => {
    setLoading(true);
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${ApiKey}&units=metric`;
    try {
      let res = await fetch(URL);
      let data = await res.json();
      console.log(data);
      if (data.cod === "404") {
        console.error("city Not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHp(data.main.humidity);
      setWs(data.wind.speed);
      setTemp(data.main.temp);
      setFeelsLike(data.main.feels_like);
      setSunrise(data.sys.sunrise);
      setSunset(data.sys.sunset);
      setDescription(data.weather[0].description);
      setCity(data.name);
      setCountry(data.sys.country);
      setLongitude(data.coord.lon);
      setLatitude(data.coord.lat);
      const weatherDescription = data.weather[0].main;
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clear);
      const backgroundImage = determineBackground(weatherDescription, weatherIconCode);
      setBackgroundImage(backgroundImage);
      setCityNotFound(false);
    } catch (error) {
      console.log("An Error Occurred:", error.message);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchData();
    }
  };

  useEffect(() => {
    searchData();
  }, []);

  return (
    <>
      <div className='container'>
        <div className="input-container">
          <input
            type="text"
            className='cityName'
            placeholder='Search city'
            onChange={handleCity}
            onKeyDown={handleKeyDown}
            value={text}
          />
          <div className="search-icon" onClick={searchData}>
            <img src={searchIcon} alt="search" className='search-icon' />
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails 
          icon={icon} 
          temp={temp} 
          city={city} 
          country={country} 
          latitude={latitude} 
          longitude={longitude} 
          hp={hp} 
          ws={ws} 
          feelsLike={feelsLike} 
          sunrise={sunrise} 
          sunset={sunset} 
          description={description} 
        />}
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
      </div>
    </>
  );
};

export default App;
