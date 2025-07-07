
import { WeatherService } from "../services/weather.service";
import { Weather } from "../models/weather.model";
import { IWeather } from "../interfaces/weather.interface";
import axios from "axios";

jest.mock("../models/weather.model");
jest.mock("axios");

const service = new WeatherService();

describe("WeatherService", () => {
  const city = "Madrid";
  const mockLocalData = [
    { city: "Madrid", temperature: 25, humidity: 50, condition: "Soleado" },
  ];

  const mockExternalData = {
    city: "Madrid",
    temperature: 26,
    humidity: 55,
    condition: "Nublado",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPEN_WEATHER_API_KEY = "FAKE_API_KEY";
  });

  describe("getWeatherByCity", () => {
    it("Devuelve datos locales y externos si existen", async () => {
      (Weather.find as jest.Mock).mockResolvedValue(mockLocalData);
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          name: "Madrid",
          main: { temp: 26, humidity: 55 },
          weather: [{ main: "Clouds" }],
        },
      });

      const result = await service.getWeatherByCity(city);

      expect(result.localData).toEqual(mockLocalData);
      expect(result.externalData).toEqual({
        city: "Madrid",
        temperature: 26,
        humidity: 55,
        condition: "Nublado",
      });
      expect(result.message).toBe(
        "Se encontraron registros locales y externos."
      );
    });

    it("Devuelve los datos locales si los externos fallan", async () => {
      (Weather.find as jest.Mock).mockResolvedValue(mockLocalData);
      (axios.get as jest.Mock).mockRejectedValue(new Error("API error"));

      const result = await service.getWeatherByCity(city);

      expect(result.localData).toEqual(mockLocalData);
      expect(result.externalData).toBeNull();
      expect(result.message).toBe(
        "No se pudo obtener información de fuentes externas."
      );
    });

    it("Devuelve los datos externos si no hay datos en la BD local", async () => {
      (Weather.find as jest.Mock).mockResolvedValue([]);
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          name: "Madrid",
          main: { temp: 26, humidity: 55 },
          weather: [{ main: "Clouds" }],
        },
      });

      const result = await service.getWeatherByCity(city);

      expect(result.localData).toBeNull();
      expect(result.externalData).toEqual({
        city: "Madrid",
        temperature: 26,
        humidity: 55,
        condition: "Nublado",
      });
      expect(result.message).toBe(
        "No hay registros climáticos en la base de datos local."
      );
    });

    it("Deberia retornar null si no hay datos externos e internos", async () => {
      (Weather.find as jest.Mock).mockResolvedValue([]);
      (axios.get as jest.Mock).mockRejectedValue(new Error("API error"));

      const result = await service.getWeatherByCity(city);

      expect(result.localData).toBeNull();
      expect(result.externalData).toBeNull();
      expect(result.message).toContain("no hay registros climáticos");
    });

    it("Tira un error en el console log si no hay api key", async () => {
      delete process.env.OPEN_WEATHER_API_KEY;

      (Weather.find as jest.Mock).mockResolvedValue([]);
      const result = await service.getWeatherByCity(city);

      expect(result.externalData).toBeNull();
      expect(result.message).toContain("no hay registros climáticos");
    });
  });

  describe("saveWeather", () => {
    it("Debe crear datos climaticos", async () => {
      const newData: IWeather = {
        city: "Barcelona",
        temperature: 20,
        humidity: 60,
        condition: "Soleado",
      };

      (Weather.create as jest.Mock).mockResolvedValue(newData);

      const result = await service.saveWeather(newData);

      expect(Weather.create).toHaveBeenCalledWith(newData);
      expect(result).toEqual(newData);
    });
  });

  describe("deleteWeatherById", () => {
    it("Elimina datos climaticos por ID", async () => {
      const mockDeleted = { city: "Madrid" };
      (Weather.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

      const result = await service.deleteWeatherById("1234");

      expect(Weather.findByIdAndDelete).toHaveBeenCalledWith("1234");
      expect(result).toEqual(mockDeleted);
    });
  });
});
