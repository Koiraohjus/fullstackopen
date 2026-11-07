import { useState, useEffect} from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() =>{
    countryService
      .getAll()
      .then(allCountries => {
        setCountries(allCountries)
      })
  },[])

  const handleFilterChange = (event) => {
    setSearchFilter(event.target.value)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase()
  .includes(searchFilter.toLowerCase()) )

  return(
    <div> 
      find countries: <input value={searchFilter} onChange={handleFilterChange}/>
      <CountryList countriesToShow={countriesToShow} setSearchFilter={setSearchFilter}/>

    </div>
  )
}

const CountryList = ({countriesToShow, setSearchFilter}) => {
  if(countriesToShow.length === 1){
    const country = countriesToShow[0]
    return (
      <Country country={country}/>
    )
  }
  if(countriesToShow.length > 10){
    return <p>Too many matches, specify another filter</p>
  }
  return(
    <>
      {countriesToShow.map(country => <div key={country.cca3}>{country.name.common} 
                                        <button onClick={() => setSearchFilter(country.name.common)}>Show</button>
                                      </div>)}
    </>
  )
}

const Country = ({country}) => {
  return(
    <div>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital[0]}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>{Object.values(country.languages).map(language => 
          <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt}/>
        <Weather country={country}/>
      </div>
  )
}

const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]
  useEffect(() => {
    weatherService
    .getWeather(lat, lon)
    .then(weatherData => {
      setWeather(weatherData)
    }).catch(error => {
      //
        console.log(error.response.data)
    })
  }
  , [lat, lon])
  
  if (!weather) {
    return <p>Loading weather...</p>
  }
  return(
    <>
     <h1>Weather in {country.capital[0]}</h1>
     <p>Temperature {weather.main.temp} Celsius </p>
     <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt="weather icon"
    />
     <p>Wind {weather.wind.speed} m/s</p>
    </>
  )
}

export default App