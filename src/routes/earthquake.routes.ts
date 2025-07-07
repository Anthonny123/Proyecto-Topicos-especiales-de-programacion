import { Router } from "express";
import {
  getEarthquakes,
  saveEarthquake,
  getEarthquakeHistory,
  deleteEarthquakeById,
} from "../controllers/earthquake.controller";
import { validateEarthquakeData } from "../middlewares/validators";

const router = Router();

/**
 * @swagger
 * /earthquake:
 *   get:
 *     summary: Obtiene sismos filtrados por país y fuente
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [USGS, Local]
 *         description: Fuente de los datos
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: País para filtrar sismos
 *     responses:
 *       200:
 *         description: Lista de sismos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.get("/", getEarthquakes);

/**
 * @swagger
 * /earthquake:
 *   post:
 *     summary: Guarda un reporte sísmico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - magnitude
 *               - depth
 *               - location
 *               - date
 *             properties:
 *               magnitude:
 *                 type: number
 *               depth:
 *                 type: number
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               source:
 *                 type: string
 *                 enum: [USGS, EMSC, Local]
 *     responses:
 *       201:
 *         description: Reporte sísmico guardado correctamente
 */
router.post("/", validateEarthquakeData, saveEarthquake);

/**
 * @swagger
 * /earthquake/history/{country}:
 *   get:
 *     summary: Obtiene historial sísmico de un país
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: País del historial sísmico
 *     responses:
 *       200:
 *         description: Historial sísmico
 *       404:
 *         description: No hay registros sísmicos
 */
router.get("/history/:country", getEarthquakeHistory);

/**
 * @swagger
 * /earthquake/{id}:
 *   delete:
 *     summary: Elimina un reporte sísmico por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del reporte sísmico
 *     responses:
 *       200:
 *         description: Reporte eliminado
 *       404:
 *         description: Reporte no encontrado
 */
router.delete("/:id", deleteEarthquakeById);

export default router;
