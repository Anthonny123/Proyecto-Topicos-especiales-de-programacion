import { Schema, model, Document } from "mongoose";
import { IEarthquake } from "../interfaces/earthqueake.interface";

export interface IEarthquakeDocument extends IEarthquake, Document {}

const EarthquakeSchema = new Schema<IEarthquakeDocument>({
  magnitude: { type: Number, required: true },
  depth: { type: Number, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  source: { type: String, enum: ["USGS", "EMSC", "Local"], default: "Local" }
}, { timestamps: true });

export const Earthquake = model<IEarthquakeDocument>("Earthquake", EarthquakeSchema);
