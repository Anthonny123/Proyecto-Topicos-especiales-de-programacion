import { RequestHandler, Request, Response } from "express";
import { WeatherService } from "../services/weather.service";
import { ApiResponse } from "../utils/apiResponse";


const weatherService = new WeatherService();

export const getWeather = async (req: Request, res: Response): Promise<void> => {
  const { city } = req.query;
  const result = await weatherService.getWeatherByCity(city as string);

  const response = new ApiResponse(
    !!(result.localData || result.externalData),
    result,
    result.message
  );

  res.json(response);
};

export const getWeatherHistory = async (req: Request, res: Response): Promise<void> => {
  const { city } = req.params;

  const history = await weatherService.getWeatherHistory(city);

  if (!history || history.length === 0) {
    const response = new ApiResponse(false, null, "No hay registros climáticos para esta ciudad.");
    res.status(404).json(response);
    return;
  }

  const response = new ApiResponse(true, history, `Historial climático de ${city}`);
  res.json(response);
};

export const saveWeather: RequestHandler = async (req, res) => {
  const savedData = await weatherService.saveWeather(req.body);
  const response = new ApiResponse(true, savedData, "Registro climático guardado correctamente");
  res.status(201).json(response);
};

export const deleteWeatherById: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await weatherService.deleteWeatherById(id);

    if (!deleted) {
      res.status(404).json(new ApiResponse(false, null, "Registro climático no encontrado"));
      return;
    }

    res.json(new ApiResponse(true, deleted, "Registro climático eliminado correctamente"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(false, null, "Error eliminando registro climático"));
  }
};