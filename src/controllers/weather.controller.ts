import { RequestHandler, Request, Response } from "express";
import { WeatherService } from "../services/weather.service";
import { ApiResponse } from "../utils/apiResponse";

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: API para gestión del clima
 */


const weatherService = new WeatherService();

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Obtiene el clima por ciudad
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la ciudad
 *     responses:
 *       200:
 *         description: Datos climáticos
 */

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

/**
 * @swagger
 * /weather/history/{city}:
 *   get:
 *     summary: Obtiene historial climático de una ciudad
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad del historial climático
 *     responses:
 *       200:
 *         description: Historial climático
 *       404:
 *         description: No hay registros climáticos
 */

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

/**
 * @swagger
 * /weather:
 *   post:
 *     summary: Guarda un registro climático
 *     tags: [Weather]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - temperature
 *               - humidity
 *               - condition
 *             properties:
 *               city:
 *                 type: string
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               condition:
 *                 type: string
 *                 enum: [Soleado, Nublado, Lluvioso, Tormenta]
 *     responses:
 *       201:
 *         description: Registro climático guardado
 */

export const saveWeather: RequestHandler = async (req, res) => {
  const savedData = await weatherService.saveWeather(req.body);
  const response = new ApiResponse(true, savedData, "Registro climático guardado correctamente");
  res.status(201).json(response);
};

/**
 * @swagger
 * /weather/{id}:
 *   delete:
 *     summary: Elimina un registro climático por ID
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro climático
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       404:
 *         description: Registro no encontrado
 */

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