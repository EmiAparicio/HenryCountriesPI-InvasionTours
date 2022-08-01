const { Country, conn } = require("../../src/db.js");

xdescribe("Country model", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );

  describe("Validators", () => {
    beforeEach(() => Country.sync({ force: true }));

    it("should throw an error if id is not a string of letters", async () => {
      expect.assertions(1);
      try {
        await Country.create({
          id: 3,
          name: "argentina",
          flag: "flag",
          continent: "continent",
          capital: "capital",
        });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
    it("should throw an error if id length is not 3", async () => {
      expect.assertions(1);
      try {
        await Country.create({
          id: "ASDF",
          name: "argentina",
          flag: "flag",
          continent: "continent",
          capital: "capital",
        });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
    it("should throw an error if name is null", async () => {
      expect.assertions(1);
      try {
        await Country.create({
          id: "ARG",
          flag: "flag",
          continent: "continent",
          capital: "capital",
        });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
    it("should throw an error if flag is null", async () => {
      expect.assertions(1);
      try {
        await Country.create({
          id: "ARG",
          name: "argentina",
          continent: "continent",
          capital: "capital",
        });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
    it("should throw an error if continent is null", async () => {
      expect.assertions(1);
      try {
        await Country.create({
          id: "ARG",
          name: "argentina",
          flag: "flag",
          capital: "capital",
        });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
    it("should throw an error if capital is null", async () => {
      expect.assertions(1);
      try {
        await Country.create({
          id: "ARG",
          name: "argentina",
          flag: "flag",
          continent: "continent",
        });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
  });

  afterAll(async () => {
    await conn.sync({ force: true });
    conn.close();
  });
});
