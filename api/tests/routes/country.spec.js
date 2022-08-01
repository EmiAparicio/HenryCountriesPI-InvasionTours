/* eslint-disable import/no-extraneous-dependencies */
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Country, conn } = require("../../src/db.js");

const agent = session(app);
const country = {
  name: "Argentina",
};

describe("Country routes", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() => Country.sync({ force: true }));

  describe("GET /countries", () => {
    it("should get 200", () => agent.get("/countries").expect(200));
  });

  afterAll(async () => {
    await conn.sync({ force: true });
    conn.close();
  });
});
