import { Diff } from "Api/SharedResources/Utils/Diff";

describe("Diff", () => {
  describe("Datetime", () => {
    const now = new Date();

    it("Should return hours", () => {
      const diffDatetime = new Diff.Datetime(new Date(now.setHours(4)), new Date(now.setHours(2)));

      expect(diffDatetime.getHours()).toBe(2);
    });

    it("Should return seconds", () => {
      const diffDatetime = new Diff.Datetime(new Date(now.setHours(4)), new Date(now.setHours(2)));

      expect(diffDatetime.getSeconds()).toBe(7200);
    });
  });

  describe("Numbers", () => {
    it("Should return a rounded number", () => expect(new Diff.Numbers(15.6, 10).getRounded()).toBe(6));

    it("Should return zero", () => expect(new Diff.Numbers(undefined, 10).getRounded()).toBe(0));
  });
});
