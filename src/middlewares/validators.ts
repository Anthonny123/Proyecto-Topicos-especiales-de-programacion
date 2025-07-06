import { Request, Response, NextFunction } from "express";

export const validateWeatherData = (req: Request, res: Response, next: NextFunction): void => {
  const { city, temperature, humidity, condition } = req.body;
  if (!city || !temperature || !humidity || !condition) {
    const error = new Error("Faltan datos requeridos: ciudad, temperatura, humedad y condición.");
    (error as any).status = 400;
    return next(error);
  }
  next();
};