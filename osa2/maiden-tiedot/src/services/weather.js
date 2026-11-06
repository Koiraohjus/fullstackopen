import axios from 'axios'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const baserUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (lat, lon) =>{
    return axios
            .get(`${baserUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.data)
}

export default { getWeather }