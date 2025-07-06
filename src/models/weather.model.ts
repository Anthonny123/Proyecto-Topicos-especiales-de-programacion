import { Schema, model, Document } from "mongoose";
import { IWeather } from "../interfaces/weather.interface";

export interface IWeatherDocument extends IWeather, Document {}

const WeatherSchema = new Schema<IWeatherDocument>({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  condition: {
    type: String,
    enum: ["Soleado", "Nublado", "Lluvioso", "Tormenta"],
    required: true
  }
}, { timestamps: true });

export const Weather = model<IWeatherDocument>("Weather", WeatherSchema);