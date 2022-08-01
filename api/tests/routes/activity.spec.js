/* eslint-disable import/no-extraneous-dependencies */
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Activity, conn } = require("../../src/db.js");

const agent = session(app);

describe("Activity routes", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() => Activity.sync({ force: true }));

  describe("Parte UNO: POST /character", () => {
    it("should return status 404 and corresponding text if no name is sent", async () => {
      const res = await agent.post("/activities");
      expect(res.statusCode).toBe(404);
      expect(res.text).toBe("Error en los datos o la actividad ya existe");
    });

    it("should return status 404 and corresponding text if any of the mandatory parameters is not sent", async () => {
      const res = await agent.post("/activities").send({ name: "Ski" });
      expect(res.statusCode).toBe(404);
      expect(res.text).toEqual("Error en los datos o la actividad ya existe");
    });

    it("should return status 201 and character object if the character was succesfully created", async () => {
      await agent.get("/countries");
      const res = await agent.post("/activities").send({
        name: "Ski",
        difficulty: 1,
        duration: 15,
        season: "Verano",
        countriesId: ["ARG"],
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.created).toEqual(true);
    });
  });

  afterAll(async () => {
    await conn.sync({ force: true });
    conn.close();
  });
});
