import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/menuItemReviewUtils";

describe("menuItemReviewUtils", () => {
  describe("cellToAxiosParamsDelete", () => {
    test("should return the correct axios params", () => {
      const cell = {
        row: {
          values: {
            id: 1,
          },
        },
      };

      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: "/api/menuitemreview",
        method: "DELETE",
        params: {
          id: 1,
        },
      });
    });
  });

  describe("onDeleteSuccess", () => {
    test("should return the response", () => {
      const response = { message: "Success" };
      const result = onDeleteSuccess(response);
      expect(result).toEqual(response);
    });
  });
});
