import app from "../index";
import request from "supertest";
import { Weather } from "../models/weather.model";

jest.mock("../models/weather.model");

describe("Weather Routes", () => {
  it("GET /api/weather/history/:city should return history", async () => {
    (Weather.find as jest.Mock).mockResolvedValue([
      { city: "Madrid", temperature: 25, humidity: 50, condition: "Soleado" },
    ]);

    const res = await request(app).get("/api/weather/history/Madrid");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [
        { city: "Madrid", temperature: 25, humidity: 50, condition: "Soleado" },
      ],
      message: "Historial climático de Madrid",
    });
  });

  it("DELETE /api/weather/:id should delete a record", async () => {
    (Weather.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "1234",
      city: "Madrid",
    });

    const res = await request(app).delete("/api/weather/1234");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        _id: "1234",
        city: "Madrid",
      },
      message: "Registro climático eliminado correctamente",
    });
  });
});
