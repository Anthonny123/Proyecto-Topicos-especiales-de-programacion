export interface IEarthquake {
  magnitude: number;
  depth: number;
  location: string;
  date: Date;
  source?: 'USGS' | 'Local'
}