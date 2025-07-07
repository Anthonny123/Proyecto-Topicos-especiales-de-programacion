import { Request, Response, RequestHandler } from "express";
import { EarthquakeService } from "../services/earthquake.service";
import { ApiResponse } from "../utils/apiResponse";

const earthquakeService = new EarthquakeService();

/**
 * @swagger
 * /earthquake:
 *   get:
 *     summary: Obtiene sismos filtrados por país y fuente
 *     tags: [Earthquake]
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

export const getEarthquakes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const source = req.query.source as string | undefined;
  const country = (req.query.country as string) || "";

  const earthquakes = await earthquakeService.getEarthquakesByCountry(
    source,
    country
  );

  const hasData =
    (earthquakes.localData?.length ?? 0) > 0 ||
    (earthquakes.externalData?.length ?? 0) > 0;

  const response = new ApiResponse(
    hasData,
    earthquakes,
    hasData
      ? `Sismos encontrados para ${country}.`
      : "No hay registros sísmicos para este país."
  );

  res.json(response);
};

/**
 * @swagger
 * /earthquake/history/{country}:
 *   get:
 *     summary: Obtiene historial sísmico de un país
 *     tags: [Earthquake]
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

export const getEarthquakeHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { country } = req.params;

  const history = await earthquakeService.getEarthquakeHistory(country);

  if (!history || history.length === 0) {
    const response = new ApiResponse(
      false,
      null,
      "No hay registros sísmicos para este país."
    );
    res.status(404).json(response);
    return;
  }

  const response = new ApiResponse(
    true,
    history,
    `Historial sísmico de ${country}`
  );
  res.json(response);
};

/**
 * @swagger
 * /earthquake:
 *   post:
 *     summary: Guarda un reporte sísmico
 *     tags: [Earthquake]
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
export const saveEarthquake: RequestHandler = async (req, res) => {
  const savedData = await earthquakeService.saveEarthquake(req.body);
  const response = new ApiResponse(
    true,
    savedData,
    "Reporte sísmico guardado correctamente"
  );
  res.status(201).json(response);
};

/**
 * @swagger
 * /earthquake/{id}:
 *   delete:
 *     summary: Elimina un reporte sísmico por ID
 *     tags: [Earthquake]
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

export const deleteEarthquakeById: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await earthquakeService.deleteEarthquakeById(id);

    if (!deleted) {
      res
        .status(404)
        .json(new ApiResponse(false, null, "Reporte sísmico no encontrado"));
      return;
    }

    res.json(
      new ApiResponse(true, deleted, "Reporte sísmico eliminado correctamente")
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiResponse(false, null, "Error eliminando reporte sísmico"));
  }
};
