import './App.css'
import sunnyIcon from './assets/weatherIcons/sunny.svg';
import humidityIcon from './assets/icons/humidity.svg';
import windSpeedIcon from './assets/icons/windSpeed.svg';

function App() {
  return (
    <div className="App">
      <div className='search-input'>
        <input type="text" />
      </div>
      <img src={sunnyIcon} className='weatherIcon' />
      <div className='myCity'>
        <h4 className='currentCity'>Tunis, Tunisia</h4>
        <div className='temperature'>
          <h2 className='currentTemperature'>30°C</h2>
          <h4 className='currentStatus'>Sunny</h4>
        </div>
      </div>
      <div className='moreInfos'>
        <div className='infos'>
          <img src={humidityIcon} alt='Humidity Icon' />
          <div className='humidityInfo'>0%<br/>Humidity</div>
        </div>
        <div className='infos'>
          <img src={windSpeedIcon} alt='Wind Speed Icon' />
          <div className='windSpeedInfo'>0Km/h<br/>Wind Speed</div>
        </div>
      </div>
    </div>
  )
}

export default App
