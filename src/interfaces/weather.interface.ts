export interface IWeather {
  city: string;
  temperature: number;
  humidity: number;
  condition: "Soleado" | "Nublado" | "Lluvioso" | "Tormenta";
}

