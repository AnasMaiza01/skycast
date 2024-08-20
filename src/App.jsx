import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import sunnyIcon from './assets/weatherIcons/sunny.svg';
import humidityIcon from './assets/icons/humidity.svg';
import windSpeedIcon from './assets/icons/windSpeed.svg';

function App() {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [windspeed, setWindspeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("");
  const [error, setError] = useState(null);
  const [searchedCities, setSearchedCities] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      const api = "https://nominatim.openstreetmap.org/reverse?lat=" + latitude + "&lon=" + longitude + "&format=json";
      axios.get(api).then((response) => {
        var data = response.data;
        setCountry(data.address.country);
        setState(data.address.state);
      })

      const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&timezone=Europe%2FMadrid`;
      axios.get(weatherApi).then((response) => {
        var data = response.data;

        const currentHour = new Date().getHours();
        const hourlyData = data.hourly;

        setTemperature(Math.round(hourlyData.temperature_2m[currentHour]));
        setHumidity(Math.round(hourlyData.relative_humidity_2m[currentHour]));
        setWindspeed(hourlyData.wind_speed_10m[currentHour]);
        const weatherCodeToDescription = {
          0: "Clear sky",
          1: "Mainly clear",
          2: "Partly cloudy",
          3: "Overcast",
          45: "Fog",
          48: "Depositing rime fog",
          51: "Light rain",
          53: "Moderate rain",
          55: "Heavy rain",
          56: "Light freezing rain",
          57: "Heavy freezing rain",
          61: "Showers of rain",
          63: "Moderate showers of rain",
          65: "Heavy showers of rain",
          66: "Light snow showers",
          67: "Heavy snow showers",
          71: "Light snow fall",
          73: "Moderate snow fall",
          75: "Heavy snow fall",
          77: "Snow grains",
          80: "Showers of rain",
          81: "Heavy showers of rain",
          82: "Very heavy showers of rain",
          85: "Light snow showers",
          86: "Heavy snow showers",
          95: "Thunderstorms",
          96: "Thunderstorms with hail",
          99: "Thunderstorms with hail"
        };
        const weatherCode = hourlyData.weathercode[currentHour];
        setWeatherCondition(weatherCodeToDescription[weatherCode] || "Unknown");        
      }).catch((err) => {
        console.error("Error fetching weather data:", err.message);
      });
    }
  }, [longitude, latitude]);

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (input == "") {
      setSearchedCities([]);
    }
    else {
      console.log(input);
      var api = `https://nominatim.openstreetmap.org/search?city=${input}&format=json`
      axios.get(api).then((response) => {
        var data = response.data;
        setSearchedCities(data.map(city => ({
          name: city.display_name,
          lat: city.lat,
          lon: city.lon,
        })));
      }).catch((err) => {
        console.error("Error fetching data:", err.message);
        setSearchedCities([]);
      });
    }
  }, [input]);

  function handleChange(e) {
      setInput(e.target.value);
  }

  function handleCityClick(lat, lon) {
    setLatitude(lat);
    setLongitude(lon);
    setInput("");
    setSearchedCities([]);
  }

  return (
    <div className="App">
      <div className='search-input'>
        <input type="text" placeholder='Search' value={input} onChange={handleChange} />
      </div>
      <div className='cities'>
        {searchedCities.map((city, index) => {
          return (
            <p key={index} className='city' onClick={() => handleCityClick(city.lat, city.lon)}>
              {city.name}
            </p>
          )
        })}
      </div>
      <img src={sunnyIcon} className='weatherIcon' />
      <div className='myCity'>
        <h4 className='currentCity'>{ state }, { country }</h4>
        <div className='temperature'>
          <h2 className='currentTemperature'>{temperature}°C</h2>
          <h4 className='currentStatus'>{ weatherCondition }</h4>
        </div>
      </div>
      <div className='moreInfos'>
        <div className='infos'>
          <img src={humidityIcon} alt='Humidity Icon' />
          <div className='humidityInfo'>{ humidity }%<br/>Humidity</div>
        </div>
        <div className='infos'>
          <img src={windSpeedIcon} alt='Wind Speed Icon' />
          <div className='windSpeedInfo'>{windspeed} Km/h<br/>Wind Speed</div>
        </div>
      </div>
    </div>
  )
}

export default App
