// src/routes/weather.routes.ts
import { Router } from "express";
import {
  getWeather,
  saveWeather,
  getWeatherHistory,
  deleteWeatherById,
} from "../controllers/weather.controller";
import { validateWeatherData } from "../middlewares/validators";

const router = Router();

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Obtiene el clima por ciudad
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
router.get("/", getWeather);

/**
 * @swagger
 * /weather:
 *   post:
 *     summary: Guarda un registro climático
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
router.post("/", validateWeatherData, saveWeather);

/**
 * @swagger
 * /weather/history/{city}:
 *   get:
 *     summary: Obtiene historial climático de una ciudad
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
router.get("/history/:city", getWeatherHistory);

/**
 * @swagger
 * /weather/{id}:
 *   delete:
 *     summary: Elimina un registro climático por ID
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
router.delete("/:id", deleteWeatherById);

export default router;
