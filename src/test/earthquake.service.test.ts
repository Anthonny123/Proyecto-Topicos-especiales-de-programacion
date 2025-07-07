import mongoose from "mongoose";
import { EarthquakeService } from "../services/earthquake.service";
import { Earthquake } from "../models/earthquake.model";
import  {IEarthquake}  from "../interfaces/earthqueake.interface";

describe("EarthquakeService", () => {
  let service: EarthquakeService;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_db");
    service = new EarthquakeService();
  });

  afterAll(async () => {
    await Earthquake.deleteMany({});
    await mongoose.connection.close();
  });

  it("should save an earthquake", async () => {
    const data:IEarthquake = {
      magnitude: 5.5,
      depth: 10,
      location: "Test City, Testland",
      date: new Date("2025-07-06"),
      source: "Local"
    };

    const result:IEarthquake = await service.saveEarthquake(data);
    expect(result.magnitude).toBe(5.5);
    expect(result.location).toContain("Test City");
  });

  it("should get earthquake history", async () => {
    const history = await service.getEarthquakeHistory("Testland");
    expect(history.length).toBeGreaterThan(0);
  });

  it("should delete an earthquake", async () => {
    const quake = await service.saveEarthquake({
      magnitude: 4.2,
      depth: 15,
      location: "Delete City",
      date: new Date(),
      source: "Local"
    });

    const deleted = await service.deleteEarthquakeById(quake._id as string);
    expect(deleted).not.toBeNull();
  });

  it("should get earthquakes from USGS", async () => {
    const data = await service["getEarthquakesFromUSGS"]("Chile");
    expect(Array.isArray(data) || data === null).toBeTruthy();
  });
});
