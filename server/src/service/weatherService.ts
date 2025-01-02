import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.OPENWEATHER_API_KEY || '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`;
    const response = await axios.get(url);
    const { coord } = response.data;
    return { lat: coord.lat, lon: coord.lon };
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(data: any): Weather {
    return {
      date: new Date(data.current.dt * 1000).toLocaleDateString(),
      temperature: data.current.temp,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_speed,
      description: data.current.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`,
    };
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(data: any): Weather[] {
    return data.daily.slice(1, 6).map((day: any) => ({
      date: new Date(day.dt * 1000).toLocaleDateString(),
      temperature: day.temp.day,
      humidity: day.humidity,
      windSpeed: day.wind_speed,
      description: day.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
    }));
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData);

    return { current: currentWeather, forecast };
  }
}

export default new WeatherService();
