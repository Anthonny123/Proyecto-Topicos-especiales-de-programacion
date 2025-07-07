// src/services/earthquake.service.ts

import axios from "axios";
import { parseStringPromise } from "xml2js";
import { Earthquake } from "../models/earthquake.model";
import { IEarthquake } from "../interfaces/earthqueake.interface";

export class EarthquakeService {

  async saveEarthquake(data: IEarthquake) {
    return await Earthquake.create(data);
  }

  async getEarthquakesByCountry(source: string | undefined, country: string): Promise<{
    localData: IEarthquake[] | null;
    externalData: IEarthquake[] | null;
    message: string;
  }> {
    let message = "";
    const localData = await Earthquake.find({ location: { $regex: country, $options: "i" } });
    
    let externalData: IEarthquake[] | null = null;
    console.log('source:', source);
    if (source === "USGS") {
      externalData = await this.getEarthquakesFromUSGS(country);
    }

    if (localData.length > 0 && externalData) {
      message = "Se encontraron registros locales y externos.";
    } else if (localData.length === 0 && externalData) {
      message = "No hay registros sísmicos en la base de datos local.";
    } else if (localData.length > 0 && !externalData) {
      message = "No se pudo obtener información de fuentes externas.";
    } else {
      message = "No hay registros sísmicos.";
    }

    return { localData: localData.length > 0 ? localData : null, externalData, message };
  }

  async getEarthquakeHistory(country: string): Promise<IEarthquake[]> {
    return Earthquake.find({ location: { $regex: country, $options: "i" } });
  }

  async deleteEarthquakeById(id: string): Promise<IEarthquake | null> {
    return Earthquake.findByIdAndDelete(id);
  }

  private async getEarthquakesFromUSGS(country: string): Promise<IEarthquake[] | null> {
    try {
      const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-07-01&minmagnitude=2`;
      const response = await axios.get(url);

      const features: USGSFeature[] = response.data.features;

      interface USGSFeature {
        properties: {
          mag: number;
          place: string;
          time: number;
        };
        geometry: {
          coordinates: number[];
        };
      }

      const earthquakes: IEarthquake[] = features
        .filter(f => f.properties.place.toLowerCase().includes(country.toLowerCase()))
        .map(f => ({
          magnitude: f.properties.mag,
          depth: f.geometry.coordinates[2],
          location: f.properties.place,
          date: new Date(f.properties.time),
          source: "USGS"
        }));

      return earthquakes.length > 0 ? earthquakes : null;

    } catch (error) {
      console.error("Error al obtener datos de USGS:", error);
      return null;
    }
  }
}
