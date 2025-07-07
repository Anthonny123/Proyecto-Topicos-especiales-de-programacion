import request from "supertest";
import app from "../index";
import { EarthquakeService } from "../services/earthquake.service";

jest.mock("../services/earthquake.service");

const mockEarthquakeService = EarthquakeService as jest.MockedClass<
  typeof EarthquakeService
>;

describe("Earthquake Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /earthquakes devuelve sismos encontrados", async () => {
    mockEarthquakeService.prototype.getEarthquakesByCountry.mockResolvedValue({
      localData: [{ _id: "1", country: "Chile", magnitude: 5.2 }],
      externalData: [],
      message: "Datos de prueba",
    } as any);

    const res = await request(app)
      .get("/api/earthquake")
      .query({ country: "Chile" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.localData).toHaveLength(1);
    expect(res.body.data.localData[0]._id).toBe("1");
  });

  it("GET /earthquakes devuelve success false cuando no hay datos", async () => {
    mockEarthquakeService.prototype.getEarthquakesByCountry.mockResolvedValue({
      localData: [],
      externalData: [],
      message: "No hay registros",
    });

    const res = await request(app)
      .get("/api/earthquake")
      .query({ country: "Nowhere" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toEqual({
      localData: [],
      externalData: [],
      message: "No hay registros",
    });
  });

  it("POST /earthquakes guarda un sismo", async () => {
    const earthquakeData = {
      country: "Chile",
      magnitude: 4.5,
      depth: 10,
      location: "Santiago",
      date: "2025-07-06",
    };

    mockEarthquakeService.prototype.saveEarthquake.mockResolvedValue({
      ...earthquakeData,
      _id: "123",
    } as any);

    const res = await request(app).post("/api/earthquake").send(earthquakeData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data._id).toBe("123");
  });

  it("DELETE api/earthquakes/:id elimina un sismo", async () => {
    mockEarthquakeService.prototype.deleteEarthquakeById.mockResolvedValue({
      _id: "123",
      country: "Chile",
      magnitude: 4.5,
    } as any);

    const res = await request(app).delete("/api/earthquake/123");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe("123");
  });

  it("DELETE /earthquakes/:id devuelve 404 si no se encuentra", async () => {
    mockEarthquakeService.prototype.deleteEarthquakeById.mockResolvedValue(
      null
    );

    const res = await request(app).delete("/api/earthquake/999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
