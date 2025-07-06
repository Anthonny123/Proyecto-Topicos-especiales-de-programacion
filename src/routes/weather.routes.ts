import { Router } from "express";
import { getWeather, saveWeather, getWeatherHistory, deleteWeatherById } from "../controllers/weather.controller";
import { validateWeatherData } from "../middlewares/validators";

const router = Router();

router.get("/", getWeather);
router.post("/", validateWeatherData, saveWeather);
router.get("/history/:city", getWeatherHistory);
router.delete("/:id", deleteWeatherById);

export default router;