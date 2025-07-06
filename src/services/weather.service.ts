// services/weather.service.ts
import { Weather } from "../models/weather.model";
import { IWeather } from "../interfaces/weather.interface";
import axios from "axios";

export class WeatherService {

  /**
   * Guarda un nuevo registro de clima en la base de datos.
   * @param data - Objeto que contiene los datos del clima a guardar.
   * @returns El registro guardado.
   */

  async saveWeather(data: IWeather) {
    return await Weather.create(data);
  }

  /**
   * Obtiene el clima por ciudad, buscando primero en la base de datos local y luego en una API externa.
   * @param city - Nombre de la ciudad para buscar el clima.
   * @returns Un objeto con los datos locales y externos del clima, o un mensaje de error.
   */

  async getWeatherByCity(city: string): Promise<{
  localData: IWeather[] | null,
  externalData: IWeather | null,
  message: string
}> {
  let message = "";
  
  const localData = await Weather.find({ city });

  const externalData = await this.getWeatherFromExternalAPI(city);

  if (localData.length > 0 && externalData) {
    message = "Se encontraron registros locales y externos.";
    return { localData, externalData, message };
  }

  if (localData.length === 0 && externalData) {
    message = "No hay registros climáticos en la base de datos local.";
    return { localData: null, externalData, message };
  }

  if (localData.length > 0 && !externalData) {
    message = "No se pudo obtener información de fuentes externas.";
    return { localData, externalData: null, message };
  }

  message = "Al parecer no puedo enviarte ningunos datos en este momento, no hay registros climáticos en la base de datos local y parece que hay problemas al conectarse con fuentes de datos externas.";
  return { localData: null, externalData: null, message };
}


  /**
   * Obtiene un registro de clima por su ID.
   * @param city - La ciudad en el registro a buscar.
   * @returns El registro encontrado o null si no se encontró.
   */
  async getWeatherHistory(city: string): Promise<IWeather[]> {
    return Weather.find({ city });
  }

  /**
   * Obtiene el clima de una API externa (OpenWeatherMap).
   * @param city - Nombre de la ciudad para buscar el clima.
   * @returns Un objeto con los datos del clima o null si hubo un error.
   */

  private async getWeatherFromExternalAPI(city: string): Promise<IWeather | null> {
    try {
      const API_KEY = process.env.OPEN_WEATHER_API_KEY;
      if (!API_KEY) {
        throw new Error("API key para OpenWeatherMap, no esta definida");
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric&lang=es`;

      const response = await axios.get(url);

      const data = response.data;

      const weatherData: IWeather = {
        city: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        condition: this.mapCondition(data.weather[0].main) 
      };

      return weatherData;
    } catch (error) {
      console.error("Error fetching external weather:", error);
      return null; 
    }
  }

  async deleteWeatherById(id: string): Promise<IWeather | null> {
    return await Weather.findByIdAndDelete(id);
  }

  /**
   * Mapea la condición del clima desde la API a un formato legible.
   * @param apiCondition - Condición del clima en formato de la API.
   * @returns Una cadena representando la condición del clima.
   */

  private mapCondition(apiCondition: string): IWeather["condition"] {
    const condition = apiCondition.toLowerCase();
    if (condition.includes("clear")) return "Soleado";
    if (condition.includes("cloud")) return "Nublado";
    if (condition.includes("rain")) return "Lluvioso";
    if (condition.includes("storm") || condition.includes("thunderstorm")) return "Tormenta";
    return "Nublado";
  }
}
