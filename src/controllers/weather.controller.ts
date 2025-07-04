import { Schema, model, Document } from "mongoose";

export interface IWeather extends Document {
  city: string;
  temperature: number;
  humidity: number;
  condition: "Soleado" | "Nublado" | "Lluvioso" | "Tormenta";
}

const WeatherSchema = new Schema<IWeather>({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  condition: {
    type: String,
    enum: ["Soleado", "Nublado", "Lluvioso", "Tormenta"],
    required: true
  }
}, { timestamps: true });

export const Weather = model<IWeather>("Weather", WeatherSchema);