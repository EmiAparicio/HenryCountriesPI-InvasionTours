/* eslint-disable import/no-extraneous-dependencies */
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Country, conn } = require("../../src/db.js");

const agent = session(app);

describe("Country routes", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() => Country.sync({ force: true }));

  describe("GET /countries", () => {
    it("should return status 200 and the list of all countries", async () => {
      const res = await agent.get("/countries");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toEqual(250);
      expect(res.body[0]).toEqual({
        name: "Svalbard and Jan Mayen",
        flag: "https://flagcdn.com/sj.svg",
        continent: "Europe",
        population: 2562,
        id: "SJM",
        Activities: [],
        Invasions: [],
      });
    });

    it("should return status 400 and the correct message if country's id is invalid", async () => {
      const res = await agent.get("/countries/1234");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("No se encontró un país con ID: 1234");
    });

    it("should return the correct country search by id", async () => {
      const res = await agent.get("/countries/ARG");
      expect(res.statusCode).toBe(200);
      expect(res.body.capital).toEqual("Buenos Aires");
    });

    it("should return the country that matches with the name filter", async () => {
      const res = await agent.get("/countries?name=Argentina");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          name: "Argentina",
          flag: "https://flagcdn.com/ar.svg",
          continent: "South America",
          population: 45376763,
          id: "ARG",
          Activities: [],
          Invasions: [],
        },
      ]);
    });
  });

  afterAll(async () => {
    await conn.sync({ force: true });
    conn.close();
  });
});
